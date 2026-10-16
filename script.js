const group = {
    weeklyContribution: 50,
    members: [],
    currentWeek: 1,
    report: []
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

addMember("Aisha");
addMember("Aisha");


