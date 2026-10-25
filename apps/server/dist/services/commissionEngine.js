export function calculateAkeezoCommission(billedAmountMinor, hospitalRate) {
    if (billedAmountMinor <= 0)
        return 0;
    switch (hospitalRate.type) {
        case "percent_of_billed":
            return Math.round((billedAmountMinor * hospitalRate.value) / 100);
        case "flat_per_episode":
            return Math.round(hospitalRate.value);
        case "slab": {
            if (!hospitalRate.slabs || hospitalRate.slabs.length === 0) {
                return 0;
            }
            const matchedSlab = hospitalRate.slabs.find((slab) => billedAmountMinor >= slab.fromMinor && billedAmountMinor < slab.toMinor);
            if (!matchedSlab) {
                // Fallback to highest slab if above all
                const highestSlab = hospitalRate.slabs[hospitalRate.slabs.length - 1];
                if (matchedSlab == null && billedAmountMinor >= highestSlab.fromMinor) {
                    if (highestSlab.type === "percent_of_billed") {
                        return Math.round((billedAmountMinor * highestSlab.value) / 100);
                    }
                    return Math.round(highestSlab.value);
                }
                return 0;
            }
            if (matchedSlab.type === "percent_of_billed") {
                return Math.round((billedAmountMinor * matchedSlab.value) / 100);
            }
            return Math.round(matchedSlab.value);
        }
        default:
            return 0;
    }
}
export function calculatePartnerShare(akeezoCommissionMinor, partnerShare, isFirstCommissionEpisode = true) {
    if (!partnerShare || akeezoCommissionMinor <= 0)
        return 0;
    switch (partnerShare.type) {
        case "percent_of_akeezo_commission":
            return Math.round((akeezoCommissionMinor * partnerShare.value) / 100);
        case "flat_per_episode":
            return Math.round(partnerShare.value);
        case "flat_per_case":
            return isFirstCommissionEpisode ? Math.round(partnerShare.value) : 0;
        default:
            return 0;
    }
}
export function calculatePartnerPayable(partnerShareMinor, akeezoCommissionMinor, hospitalReceivedMinor, partnerPaidMinor, payoutTrigger = "on_hospital_receipt", isInvoiced = false) {
    let earnedPartnerShare = 0;
    if (payoutTrigger === "on_hospital_receipt") {
        if (akeezoCommissionMinor > 0) {
            const receiptRatio = Math.min(1, hospitalReceivedMinor / akeezoCommissionMinor);
            earnedPartnerShare = Math.round(partnerShareMinor * receiptRatio);
        }
    }
    else if (payoutTrigger === "on_invoice") {
        earnedPartnerShare = isInvoiced ? partnerShareMinor : 0;
    }
    else {
        // manual: requires explicit finance action
        earnedPartnerShare = partnerShareMinor;
    }
    const netPayable = earnedPartnerShare - partnerPaidMinor;
    if (netPayable < 0) {
        return {
            partnerPayableMinor: netPayable,
            recoveryDueMinor: Math.abs(netPayable),
        };
    }
    return {
        partnerPayableMinor: netPayable,
        recoveryDueMinor: 0,
    };
}
export function deriveCommissionStatus(params) {
    const { hasInvoice, hospitalReceivedMinor, akeezoCommissionMinor, partnerPaidMinor, partnerShareMinor, currentStatus, } = params;
    if (currentStatus === "disputed" || currentStatus === "written_off") {
        return currentStatus;
    }
    if (partnerShareMinor > 0 && partnerPaidMinor >= partnerShareMinor && hospitalReceivedMinor >= akeezoCommissionMinor) {
        return "paid";
    }
    if (partnerPaidMinor > 0 && partnerPaidMinor < partnerShareMinor) {
        return "partially_paid";
    }
    if (hospitalReceivedMinor >= akeezoCommissionMinor && akeezoCommissionMinor > 0) {
        return "received";
    }
    if (hospitalReceivedMinor > 0 && hospitalReceivedMinor < akeezoCommissionMinor) {
        return "partially_received";
    }
    if (hasInvoice) {
        return "invoiced";
    }
    return "expected";
}
