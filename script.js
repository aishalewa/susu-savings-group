const group = {
    weeklyContribution: 50,
    members: [],
    currentWeek: 1,
    payments: [],
    payoutHistory: []
}

console.log(group);

function addMember(name) {
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


