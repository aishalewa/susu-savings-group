const group = {
    weeklyContribution: 50,
    members: [],
    currentWeek: 1,
    payments: [],
    payoutHistory: []
}

console.log(group);

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



//convert amount to integer to avoid floating-point errors
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




addMember("Aisha");
addMember("Aisha");

console.log(toMinorUnits(50.00))
console.log(formatGHS(50.00))


