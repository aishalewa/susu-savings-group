
const test = require("node:test");
const assert = require("node:assert/strict");

const {
    group,
    addMember,
    toMinorUnits,
    formatGHS,
    recordContribution,
    getMemberPaymentStatus,
    closeWeek
} = require("./script");


// Reset the group before each test so tests are independent.
function resetGroup() {
    group.weeklyContribution = 50.00;
    group.members = [];
    group.currentWeek = 1;
    group.payments = [];
    group.payoutHistory = [];
}


// Capture console output when a function logs a message.
function captureConsole(callback) {
    const originalLog = console.log;
    const messages = [];

    console.log = (...args) => {
        messages.push(args.join(" "));
    };

    try {
        callback();
    } finally {
        console.log = originalLog;
    }

    return messages.join("\n");
}


// TEST 1: Money conversion is exact.
test("converts GHS amounts into integer hundredths", () => {
    assert.equal(toMinorUnits("50.00"), 5000);
    assert.equal(toMinorUnits("30.50"), 3050);
    assert.equal(toMinorUnits("20"), 2000);
});


// TEST 2: Money formatting is correct.
test("formats internal amounts as GHS", () => {
    assert.equal(formatGHS(5000), "GHS 50.00");
    assert.equal(formatGHS(3050), "GHS 30.50");
    assert.equal(formatGHS(5), "GHS 0.05");
});


// TEST 3: A member can be added.
test("adds a member with a numeric ID", () => {
    resetGroup();

    addMember("Aisha");

    assert.equal(group.members.length, 1);
    assert.deepEqual(group.members[0], {
        id: 1,
        name: "Aisha"
    });
});


// TEST 4: Duplicate names are rejected.
test("rejects duplicate member names", () => {
    resetGroup();

    addMember("Aisha");

    addMember("Aisha");

    addMember("AISHA");

    assert.equal(group.members.length, 1);
});


// TEST 5: A partial payment is recorded correctly.
test("records partial contributions and calculates the balance", () => {
    resetGroup();

    addMember("Ama");

    recordContribution(1, "30.00");

    const status = getMemberPaymentStatus(1, 1);

    assert.equal(status.amountPaid, 3000);
    assert.equal(status.amountOwed, 2000);
    assert.equal(status.paidInFull, false);
});


// TEST 6: A member can complete a contribution in instalments.
test("accepts multiple payments up to the weekly contribution", () => {
    resetGroup();

    addMember("Ama");

    recordContribution(1, "20.00");
    recordContribution(1, "30.00");

    const status = getMemberPaymentStatus(1, 1);

    assert.equal(status.amountPaid, 5000);
    assert.equal(status.amountOwed, 0);
    assert.equal(status.paidInFull, true);
});


// TEST 7: Unknown members cannot make payments.
test("rejects a payment from an unknown member", () => {
    resetGroup();

    const output = captureConsole(() => {
        recordContribution(99, "50.00");
    });

    assert.match(output, /Member not found/);
    assert.equal(group.payments.length, 0);
});


// TEST 8: Invalid, zero, and negative payments are rejected.
test("rejects invalid payment amounts", () => {
    resetGroup();

    addMember("Ama");

    recordContribution(1, "0");
    recordContribution(1, "-10.00");
    recordContribution(1, "abc");
    recordContribution(1, "10.999");

    assert.equal(group.payments.length, 0);
});


// TEST 9: Overpayments are rejected.
test("does not accept payments above the amount owed", () => {
    resetGroup();

    addMember("Ama");

    recordContribution(1, "40.00");

    const output = captureConsole(() => {
        recordContribution(1, "20.00");
    });

    assert.match(output, /only owes GHS 10\.00/);

    const status = getMemberPaymentStatus(1, 1);

    assert.equal(status.amountPaid, 4000);
    assert.equal(status.amountOwed, 1000);
});


// TEST 10: A week cannot close while a member owes money.
test("prevents closing an unpaid week", () => {
    resetGroup();

    addMember("Ama");
    addMember("Kofi");

    recordContribution(1, "50.00");
    recordContribution(2, "30.00");

    const output = captureConsole(() => {
        closeWeek();
    });

    assert.match(output, /cannot close yet/i);
    assert.equal(group.currentWeek, 1);
    assert.equal(group.payoutHistory.length, 0);
});


// TEST 11: A fully paid week closes and pays the correct pot.
test("closes a fully paid week and pays the first member", () => {
    resetGroup();

    addMember("Ama");
    addMember("Kofi");

    recordContribution(1, "50.00");
    recordContribution(2, "50.00");

    closeWeek();

    assert.equal(group.currentWeek, 2);
    assert.equal(group.payoutHistory.length, 1);

    assert.equal(group.payoutHistory[0].recipientName, "Ama");
    assert.equal(group.payoutHistory[0].amount, 10000);
});


// TEST 12: Payouts rotate in joining order.
test("pays the next member in joining order in the following week", () => {
    resetGroup();

    addMember("Ama");
    addMember("Kofi");

    // Week 1 contributions.
    recordContribution(1, "50.00");
    recordContribution(2, "50.00");

    closeWeek();

    // Week 2 contributions.
    recordContribution(1, "50.00");
    recordContribution(2, "50.00");

    closeWeek();

    assert.equal(group.payoutHistory.length, 2);
    assert.equal(group.payoutHistory[0].recipientName, "Ama");
    assert.equal(group.payoutHistory[1].recipientName, "Kofi");
    assert.equal(group.currentWeek, 3);
});
