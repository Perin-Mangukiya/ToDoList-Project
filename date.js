module.exports.getDate = function() {
    const today = new Date();
    
    const options = {
        weekday: "long", 
        day: "numeric",
        month: "long"
    };
    
    return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = function () {
    const today = new Date();
    
    const options = {
        weekday: "long"
    };
    
    return today.toLocaleDateString("en-US", options);
}

// returns value from 0 to 6, 0->Sunday, 1->Monday, ... 
// var currentDay = today.getDay();
// var day = "";
// if(currentDay==1)
// day = "Monday";
// else if(currentDay==2)
// day = "Tuesday";
// else if(currentDay==3)
// day = "Wednesday";
// else if(currentDay==4)
// day = "Thursday";
// else if(currentDay==5)
// day = "Friday";
// else if(currentDay==6)
// day = "Saturday";
// else
// day = "Sunday";

// To format the date properly