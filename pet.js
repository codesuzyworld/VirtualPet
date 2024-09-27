window.onload = loadHandle;

function loadHandle() {
    "use strict";

    //Declare the HTML elements
    //Adopt Pet
    const createBtn = document.querySelector('#createBtn');
    const adoptionBtn = document.querySelector('#adoptionBtn');
    //Greeting
    let greeting = document.querySelector("#greeting");
    let timeDisplay = document.querySelector("#time");
    //Pet Stats
    let fullnessDisplay = document.querySelector("#fullness");
    let moodDisplay = document.querySelector("#mood");
    let ageDisplay = document.querySelector("#age");

    //Get stats from local storage
    let petData = JSON.parse(localStorage.getItem("pet"));


    //Object that defines the pet
    let pet = {
        name: '',
        fullness: "",
        mood: "",
        age: 0,
        lastUpdated: Date.now()
    };

    //If previous data for pet exists, then load it.
    //But if a pet has not been created, then instruct the user to adopt a pet
    if (petData) {
        pet = petData;
        $("#petMain").show();
        $("#adoptionSection").show();
        $(".petForm").hide();
    } else {
        $("#petMain").hide();
        $(".petForm").show();
        $("#adoptionSection").hide();
    }

    //Display date
    function displayDate(){
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let date = new Date();
        const dayOfWeek = weekdays[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        timeDisplay.innerHTML = `Today is ${dayOfWeek} ${month} ${year}`;
    }

    //This function displays the stats of the pet
    function displayStats(){
        greeting.innerHTML = `Welcome back, ${pet.name} misses you!`;
        ageDisplay.innerHTML = `Age: ${pet.age}`;
        // fullnessDisplay.innerHTML = `Hunger: ${pet.fullness}`;
        // moodDisplay.innerHTML = `Mood: ${pet.mood}`;

        //Display pet hunger
        let hungerStatus = "";
        if (pet.fullness <=33){
            hungerStatus = "Hungry";
        } else if (pet.fullness <= 66){
            hungerStatus = "Moderate";
        } else if (pet.fullness <= 99){
            hungerStatus = "Full";
        }
        fullnessDisplay.innerHTML = `Hunger: ${hungerStatus} ${pet.fullness}`;

        //Display Mood
        let moodStatus = "";
        if (pet.mood <=33){
            moodStatus = "Sad";
        } else if (pet.mood <= 66){
            moodStatus = "Neutral";
        } else if (pet.fullness <= 99){
            moodStatus = "Happy";
        }
        moodDisplay.innerHTML = `Mood: ${moodStatus} ${pet.mood}`;

    }

    //This function saves the stats of the pet, and sends it to local storage
    function saveStats(){
        pet.lastUpdated = Date.now();
        localStorage.setItem('pet', JSON.stringify(pet));
        displayStats();
    }

    //This function updates the stats every 12 hours
    function petStatUpdate(){
        let currentTime = Date.now();
        let timePassed = (currentTime - pet.lastUpdated) / 1000;    
        // Decrease fullness and mood based on time passed
        let intervalsPassed = Math.floor(timePassed / 10); 
        let hungerDecrease = intervalsPassed * 33; 
        let moodDecrease = intervalsPassed * 20;  
    
        pet.fullness = Math.max(0, pet.fullness - hungerDecrease);
        pet.mood = Math.max(0, pet.mood - moodDecrease);
    
        saveStats();
    
    }

    setInterval(() => {
        // Save the updated stats and update the display
        petStatUpdate();
        displayStats();
        console.log("Stats decreased")
    }, 10000); 

    //Event Handler

    //Displays information
    displayDate();
    displayStats();
    petStatUpdate();
    //Create Pet
    createBtn.addEventListener('click', function(event) {
        event.preventDefault();
        //Get the name of the pet from the form
        const petName = document.querySelector('#petName').value;
        //Set default value of the pet
        pet.name = petName;
        pet.fullness = 100;
        pet.mood = 100;
        pet.age = 0;
        saveStats();
        //Show the pet screen and start game
        $("#petMain").show();
        $("#adoptionSection").show();
        $(".petForm").hide();
    });

    //Send Pet to Adoption
    adoptionBtn.addEventListener('click', function(event) {
        event.preventDefault();
        //Clear local storage
        localStorage.removeItem('pet')
        //Hide the pet screen and prompt user to adopt again
        $("#petMain").hide();
        $(".petForm").show();
        $("#adoptionSection").hide();
    });

    //Feed Pet
    feedBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (pet.fullness < 99){
            pet.fullness += 33;  
            saveStats();
        } else if (pet.fullness >= 99) {
            alert("I am full already! Plz no feed :(");
        }
    });

    // Pet your Pet
    petBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (pet.mood < 100){
            pet.mood += 20;  
            saveStats();
        } else if (pet.mood >= 100) {
            alert("I happy already!");
        }
    });
}