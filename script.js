const group = {
    weeklyContribution: 50,
    members: [],
    currentWeek: 1,
    payments: [],
    payoutHistory: []
}

// console.log(group);

function toMinorUnits(amount) {
    const amountText = String(amount).trim();

    // Accept only non-negative amounts with up to 2 decimal places.
    if (!/^\d+(\.\d{1,2})?$/.test(amountText)) {
        return null;
    }

    const [whole, decimal = ""] = amountText.split(".");

    return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
}

function formatGHS(amountUnits) {
    const whole = Math.floor(amountUnits / 100);
    const decimal = amountUnits % 100;

    return `GHS ${whole}.${String(decimal).padStart(2, "0")}`;
}

function getWeeklyContributionUnits() {
    return toMinorUnits(group.weeklyContribution);
}

function addMember(name) {
    if (typeof name !== "string") {
        console.log("Please enter a valid member name.");
        return;
    }
    const clearName = name.trim();

    if (clearName === "") {
        console.log("Please enter a member's name.");
        return;
    };

    const existingName = group.members.some(
        member => member.name.toLowerCase() === clearName.toLowerCase()
    );

    if (existingName){
        console.log(`${clearName} is already a member`);
        return;
    }

    const member = {
    id: group.members.length + 1,
    name: clearName
};

//add new member to the members array
group.members.push(member);
console.log(`${clearName} has been added successfully.`);


};

function recordContribution(memberId, amount) {
    // Find the member making the payment.
    const member = group.members.find(
        member => member.id === memberId
    );

    if (!member) {
        console.log("Error: Member not found.");
        return;
    }

    const paymentAmount = toMinorUnits(amount);

    // Reject invalid, zero or negative amounts.
    if (paymentAmount === null || paymentAmount <= 0) {
        console.log("Error: Enter a valid amount greater than zero.");
        return;
    }

    // Find all this member's payments for the current week.
    const amountAlreadyPaid = group.payments
        .filter(payment =>
            payment.memberId === memberId &&
            payment.week === group.currentWeek
        )
        .reduce((total, payment) => total + payment.amount, 0);

    const amountOwed =
        getWeeklyContributionUnits() - amountAlreadyPaid;

    // Reject payments greater than the outstanding balance.
    if (paymentAmount > amountOwed) {
        console.log(
            `Error: ${member.name} only owes ${formatGHS(amountOwed)}.`
        );
        return;
    }

    group.payments.push({
        memberId: memberId,
        week: group.currentWeek,
        amount: paymentAmount
    });

    console.log(
        `${member.name} paid ${formatGHS(paymentAmount)} for week ${group.currentWeek}.`
    );
}

function getMemberPaymentStatus(memberId, week) {
    const amountPaid = group.payments
        .filter(payment =>
            payment.memberId === memberId &&
            payment.week === week
        )
        .reduce((total, payment) => total + payment.amount, 0);

    const amountOwed = getWeeklyContributionUnits() - amountPaid;

    return {
        amountPaid: amountPaid,
        amountOwed: amountOwed,
        paidInFull: amountOwed === 0
    };
}

function showReport() {
    console.log("\n===== SUSU GROUP REPORT =====");
    console.log(
        `Weekly contribution: ${formatGHS(getWeeklyContributionUnits())}`
    );
    console.log(`Current week: ${group.currentWeek}`);

    console.log("\n--- Current Week Payments ---");

    if (group.members.length === 0) {
        console.log("No members have joined yet.");
    }

    group.members.forEach(member => {
        const status = getMemberPaymentStatus(
            member.id,
            group.currentWeek
        );

        if (status.paidInFull) {
            console.log(`${member.name}: Paid in full`);
        } else {
            console.log(
                `${member.name}: Paid ${formatGHS(status.amountPaid)}, owes ${formatGHS(status.amountOwed)}`
            );
        }
    });
    console.log("\n--- Payout History ---");

    if (group.payoutHistory.length === 0) {
        console.log("No payouts have been made yet.");
    } else {
        group.payoutHistory.forEach(payout => {
            console.log(
                `Week ${payout.week}: ${payout.recipientName} received ${formatGHS(payout.amount)}`
            );
        });
    }

    console.log("============================\n");
}

function closeWeek() {
    // A group without members cannot receive contributions or pay out.
    if (group.members.length === 0) {
        console.log("Cannot close the week because there are no members.");
        return;
    }

    // Find every member who has not paid the full contribution.
    const membersWhoOwe = group.members
        .map(member => ({
            member: member,
            status: getMemberPaymentStatus(
                member.id,
                group.currentWeek
            )
        }))
        .filter(item => !item.status.paidInFull);

    // Do not pay out or advance the week if anyone still owes money.
    if (membersWhoOwe.length > 0) {
        console.log(`Week ${group.currentWeek} cannot close yet.`);

        membersWhoOwe.forEach(item => {
            console.log(
                `${item.member.name} owes ${formatGHS(item.status.amountOwed)}.`
            );
        });

        return;
    }

    const recipientIndex =
        group.payoutHistory.length % group.members.length;

    const recipient = group.members[recipientIndex];

    // Calculate the pot using exact internal units.
    const pot =
        getWeeklyContributionUnits() * group.members.length;

    // Save the successful payout in the history.
    group.payoutHistory.push({
        week: group.currentWeek,
        recipientId: recipient.id,
        recipientName: recipient.name,
        amount: pot
    });

    console.log(`Week ${group.currentWeek} closed successfully.`);
    console.log(
        `${recipient.name} receives the pot of ${formatGHS(pot)}.`
    );

    // Advance to the next week only after a successful payout.
    group.currentWeek++;
}



module.exports = {
    group,
    addMember,
    toMinorUnits,
    formatGHS,
    getWeeklyContributionUnits,
    recordContribution,
    getMemberPaymentStatus,
    showReport,
    closeWeek
};



