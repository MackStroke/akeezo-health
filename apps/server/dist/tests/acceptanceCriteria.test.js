import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateAkeezoCommission, calculatePartnerShare, calculatePartnerPayable, deriveCommissionStatus, } from "../services/commissionEngine.js";
import { encryptSensitiveField, decryptSensitiveField, maskSensitiveValue, } from "../utils/crypto.js";
describe("Phase 1 Acceptance Criteria Verification", () => {
    // AC-7: Commission Calculation
    it("AC-7: Given billed 10,00,000 INR, 15% hospital rate, 40% partner share -> Akeezo 1,50,000, Partner 60,000, Net 90,000", () => {
        // 10,00,000 INR = 100000000 minor units (paise)
        const billedAmountMinor = 100000000;
        const hospitalRate = {
            type: "percent_of_billed",
            value: 15,
        };
        const partnerAgreement = {
            type: "percent_of_akeezo_commission",
            value: 40,
            payoutTrigger: "on_hospital_receipt",
        };
        const akeezoCommissionMinor = calculateAkeezoCommission(billedAmountMinor, hospitalRate);
        const partnerShareMinor = calculatePartnerShare(akeezoCommissionMinor, partnerAgreement, true);
        const akeezoNetMinor = akeezoCommissionMinor - partnerShareMinor;
        // Akeezo commission: 1,50,000 INR = 15000000 minor
        assert.equal(akeezoCommissionMinor, 15000000);
        // Partner share: 60,000 INR = 6000000 minor
        assert.equal(partnerShareMinor, 6000000);
        // Akeezo net: 90,000 INR = 9000000 minor
        assert.equal(akeezoNetMinor, 9000000);
    });
    // AC-8: Partial Payment & Proportional Partner Payable
    it("AC-8: Hospital pays 75,000 (50%) -> Partner payable 30,000; Hospital pays second 75,000 -> Total partner payable 60,000", () => {
        const akeezoCommissionMinor = 15000000; // 1,50,000 INR
        const partnerShareMinor = 6000000; // 60,000 INR
        // First payment: Hospital pays 75,000 INR (7500000 minor), partner paid so far 0
        let hospitalReceivedMinor = 7500000;
        let partnerPaidMinor = 0;
        let payableResult = calculatePartnerPayable(partnerShareMinor, akeezoCommissionMinor, hospitalReceivedMinor, partnerPaidMinor, "on_hospital_receipt");
        assert.equal(payableResult.partnerPayableMinor, 3000000); // 30,000 INR payable
        assert.equal(payableResult.recoveryDueMinor, 0);
        // Partner is paid 30,000 INR
        partnerPaidMinor += payableResult.partnerPayableMinor;
        // Second payment: Hospital pays remaining 75,000 INR -> total received 1,50,000 INR
        hospitalReceivedMinor += 7500000;
        payableResult = calculatePartnerPayable(partnerShareMinor, akeezoCommissionMinor, hospitalReceivedMinor, partnerPaidMinor, "on_hospital_receipt");
        assert.equal(payableResult.partnerPayableMinor, 3000000); // Remaining 30,000 INR payable
        assert.equal(partnerPaidMinor + payableResult.partnerPayableMinor, 6000000); // Total 60,000 INR
    });
    // AC-9: Adjustment & Recovery Due on Revised Bill
    it("AC-9: Given bill revised to 8,00,000 INR after 60,000 INR was paid -> Commission 1,20,000, Partner share 48,000, Recovery Due 12,000", () => {
        const revisedBilledAmountMinor = 80000000; // 8,00,000 INR
        const hospitalRate = { type: "percent_of_billed", value: 15 };
        const partnerAgreement = {
            type: "percent_of_akeezo_commission",
            value: 40,
            payoutTrigger: "on_hospital_receipt",
        };
        const newAkeezoCommissionMinor = calculateAkeezoCommission(revisedBilledAmountMinor, hospitalRate);
        const newPartnerShareMinor = calculatePartnerShare(newAkeezoCommissionMinor, partnerAgreement, true);
        assert.equal(newAkeezoCommissionMinor, 12000000); // 1,20,000 INR
        assert.equal(newPartnerShareMinor, 4800000); // 48,000 INR
        // Partner was already paid 60,000 INR (6000000 minor)
        const partnerPaidMinor = 6000000;
        const hospitalReceivedMinor = 12000000;
        const payableResult = calculatePartnerPayable(newPartnerShareMinor, newAkeezoCommissionMinor, hospitalReceivedMinor, partnerPaidMinor, "on_hospital_receipt");
        assert.equal(payableResult.partnerPayableMinor, -1200000); // -12,000 INR (Negative)
        assert.equal(payableResult.recoveryDueMinor, 1200000); // 12,000 INR shown as recovery due
    });
    // Slab agreement calculation
    it("Hospital Slab Calculation: 0-5L @ 12%, 5-20L @ 15%, >20L @ 18%", () => {
        const slabAgreement = {
            type: "slab",
            value: 15,
            slabs: [
                { fromMinor: 0, toMinor: 50000000, type: "percent_of_billed", value: 12 },
                { fromMinor: 50000000, toMinor: 200000000, type: "percent_of_billed", value: 15 },
                { fromMinor: 200000000, toMinor: 1000000000, type: "percent_of_billed", value: 18 },
            ],
        };
        // 4 Lakhs (40000000 minor) -> 12% = 48,000 (4800000 minor)
        assert.equal(calculateAkeezoCommission(40000000, slabAgreement), 4800000);
        // 10 Lakhs (100000000 minor) -> 15% = 1,50,000 (15000000 minor)
        assert.equal(calculateAkeezoCommission(100000000, slabAgreement), 15000000);
        // 25 Lakhs (250000000 minor) -> 18% = 4,50,000 (45000000 minor)
        assert.equal(calculateAkeezoCommission(250000000, slabAgreement), 45000000);
    });
    // AES-256-GCM encryption & identity masking
    it("AC-10: Passport encryption, decryption, and identity masking", () => {
        const rawPassport = "A12345678";
        const encrypted = encryptSensitiveField(rawPassport);
        // Verify it is not plaintext
        assert.notEqual(encrypted, rawPassport);
        assert.ok(encrypted.includes(":"));
        // Verify decryption
        const decrypted = decryptSensitiveField(encrypted);
        assert.equal(decrypted, rawPassport);
        // Verify masking (only last 3 visible)
        const masked = maskSensitiveValue(encrypted, 3);
        assert.equal(masked, "******678");
    });
    // Commission Status Lifecycle Derivation
    it("Status Derivation: expected -> invoiced -> partially_received -> received -> paid", () => {
        // 1. Initial
        let status = deriveCommissionStatus({
            hasInvoice: false,
            hospitalReceivedMinor: 0,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "expected");
        // 2. Invoiced
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 0,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "invoiced");
        // 3. Partially Received
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 7500000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "partially_received");
        // 4. Fully Received from Hospital
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 15000000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "received");
        // 5. Partially Paid to Partner
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 15000000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 3000000,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "partially_paid");
        // 6. Fully Paid
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 15000000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 6000000,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "paid");
    });
});
