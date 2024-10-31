window.onload = loadHandle;

function loadHandle() {
    "use strict";

    // Declare the HTML elements
    // Adopt Pet
    const createBtn = document.querySelector('#createBtn');
    const adoptionBtn = document.querySelector('#adoptionBtn');
    // Greeting
    let greeting = document.querySelector("#greeting");
    let timeDisplay = document.querySelector("#time");
    // Pet Stats
    let fullnessDisplay = document.querySelector("#fullness");
    let moodDisplay = document.querySelector("#mood");
    let ageDisplay = document.querySelector("#age");
    // Pet Portrait
    let hungerImage = document.getElementById("hungerImage");
    let moodImage = document.getElementById("moodImage");
    // Get stats from local storage
    let petData = JSON.parse(localStorage.getItem("pet"));

    // Object that defines the pet
    let pet = {
        name: '',
        fullness: 0,
        mood: 0,
        age: 0,
        birthday: 0,
        lastUpdated: Date.now()
    };

    // Validate and load existing pet data if present
    if (petData && petData.name) {
        pet = petData;
        $("#petMain").show();
        $("#adoptionSection").show();
        $(".petForm").hide();
        displayStats();
        startIntervals();
    } else {
        // No valid pet data, show the adoption form
        $("#petMain").hide();
        $(".petForm").show();
        $("#adoptionSection").hide();
    }


    // Function to start intervals for updating stats
    function startIntervals() {
        setInterval(() => {
            if (pet.name) {  // Only update stats if pet has a name
                petStatUpdate();
                displayStats();
                ageUpdate();
            }
        }, 10000);

        setInterval(() => {
            if (pet.name) {  // Only display stats if pet has a name
                displayStats();
            }
            console.log("Stats displayed");
        }, 1000);
    }
    //Portrait Update
    function updatePortrait() {
        // Update hunger image based on hunger level
        if (pet.fullness <= 33) {
            hungerImage.src = "img/hungry.png";
        } else if (pet.fullness <= 66) {
            hungerImage.src = "img/moderate.png";
        } else {
            hungerImage.src = "img/full.png";
        }
    
        // Update mood image based on mood level
        if (pet.mood <= 33) {
            moodImage.src = "img/sad.png";
        } else if (pet.mood <= 66) {
            moodImage.src = "img/neutral.png";
        } else {
            moodImage.src = "img/happy.png";
        }
    }

    // Display date
    function displayDate() {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let date = new Date();
        const dayOfWeek = weekdays[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()]; 
        const year = date.getFullYear();
        timeDisplay.innerHTML = `Today is ${dayOfWeek} ${month} ${day}, ${year}`;
    }

    // This function displays the stats of the pet
    function displayStats(){
        if (!pet.name) return; // Stop if no pet exists

        greeting.innerHTML = `Welcome back, ${pet.name} misses you!`;
        ageDisplay.innerHTML = `Age: ${pet.age} Days Old`;

        // Display pet hunger
        let hungerStatus = pet.fullness <= 33 ? "Hungry" : pet.fullness <= 66 ? "Moderate" : "Full";
        fullnessDisplay.innerHTML = `Hunger: ${hungerStatus}`;

        // Display Mood
        let moodStatus = pet.mood <= 33 ? "Sad" : pet.mood <= 66 ? "Neutral" : "Happy";
        moodDisplay.innerHTML = `Mood: ${moodStatus}`;

        updatePortrait();
    }

    // This function saves the stats of the pet and sends it to local storage
    function saveStats(){
        if (!pet.name) return; // Stop if no pet exists
        pet.lastUpdated = Date.now();
        localStorage.setItem('pet', JSON.stringify(pet));
        displayStats();
    }

    // This function updates the stats every 12 hours
    function petStatUpdate(){
        if (!pet.name) return; // Stop if no pet exists
        let currentTime = Date.now();
        let timePassed = (currentTime - pet.lastUpdated) / 1000;    
        // Decrease fullness and mood based on time passed
        let intervalsPassed = Math.floor(timePassed / 10); 
        pet.fullness = Math.max(0, pet.fullness - intervalsPassed * 33);
        pet.mood = Math.max(0, pet.mood - intervalsPassed * 20);
        saveStats();

    }

    function ageUpdate(){
        if (!pet.name) return; // Stop if no pet exists
        let ageInMilliseconds = Date.now() - pet.birthday;
        pet.age = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
        saveStats();
    }



    // Display the date when the page loads
    displayDate();

    // Event Handler: Adopt Pet
    createBtn.addEventListener('click', function(event) {
        event.preventDefault();




        // Get the name of the pet from the form
        const petName = document.querySelector('#petName').value;
        const petNameInput = document.querySelector('#petName');

        // Check if the pet name is empty
        if (!petName) {
            petNameInput.style.background = "#D84C43";
            return; 
        }

        // Remove the red border if the input is valid
        petNameInput.style.background = ""; 

        // Set default values of the pet
        pet.name = petName;
        pet.fullness = 100;
        pet.mood = 100;
        pet.age = 0;
        pet.birthday = Date.now();
        saveStats();
        // Show the pet screen and start game
        $("#petMain").show();
        $("#adoptionSection").show();
        $(".petForm").hide();
        startIntervals(); // Start intervals after pet is created
    });

    // Event Handler: Send Pet to Adoption
    adoptionBtn.addEventListener('click', function(event) {
        event.preventDefault();
        // Clear local storage
        localStorage.removeItem('pet');
        // Hide the pet screen and prompt user to adopt again
        $("#petMain").hide();
        $(".petForm").show();
        $("#adoptionSection").hide();
    });

    // Feed Pet
    feedBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (pet.fullness < 99){
            pet.fullness += 33;  
            saveStats();
            updatePortrait();
        } else {
            alert("I am full already! I can't eat anymore :(");
        }
    });

    // Pet your Pet
    petBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (pet.mood < 100){
            pet.mood += 20;  
            saveStats();
            updatePortrait();
        } else {
            alert("Thanks! But I'm already happy :D");
        }
    });
}