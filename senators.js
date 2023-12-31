// fetch data from the JSON file
// adding error check function
async function getData() {
    let json;
    try {
        // try block 
        let data = await fetch("./json/senators.json");
        // if not successful:
        if (data.ok) {
            json = await data.json(); //assign value don't declare, scoping was causing me heartfailure :) 
        } else if (data.status >= 400 && data.status < 500) {
            // Client-side error
            document.getElementById("div").innerText = "Client-side error: HTTP status code " + data.status;
        } else if (data.status >= 500) {
            // Server-side error
            document.getElementById("div").innerText = "Server-side error: HTTP status code " + data.status;
        } else {
            // Unknown error
            document.getElementById("div").innerText = "Unknown error: HTTP status code " + data.status;
        }
    }
    catch (error) {
        document.getElementById("div").innerText = "Error: " + error.message;
    }

    return json;

}

// count senators by party
// takes in data object
// returns an object with key:values as  party_name: count
function countSenatorsByParty(data) {
    let partyCount = {}; //Count of each party

    // Iterate through each senator in data
    for (let senator of data.objects) {
        // Add party if doesn't exist already
        if (!partyCount[senator.party]) {
            partyCount[senator.party] = 0;
        }
        // Increment number of senators of that party
        partyCount[senator.party] += 1;
    }
    return partyCount;
}

// This function will make the bar chart showing how many senators are in each party
// Takes in party objecy where key is party name and value is count of that party
function makeBarChart(partyObj) {

    // Get total senators
    let totalSenators = 0;
    for (key in partyObj) {
        totalSenators += partyObj[key];
    }

    // loop that creates boxes for each party
    let delay = 2000; //Delay before bar shoots up
    for (let key in partyObj) { //iterate over all of the parties(keys)
        // Create container for the bar
        let c = document.createElement("div")
        c.setAttribute("id", key + "-party");
        c.classList.add("bar-container")
        // Create the bar
        let el = document.createElement("div");
        el.classList.add("bar");
        el.classList.add(key);
        el.setAttribute("style", "width: 0"); //set the width to 0 initially, bar will grow to proportional size after delay time
        document.getElementById("bar-chart").appendChild(c).appendChild(el);
        // This function will set the width of the bar
        function setWidth() {
            el.setAttribute("style", "width: " + partyObj[key] * 100 / totalSenators.toString() + "vw");
        }
        // Set timeout
        setTimeout(setWidth, delay);


        // Make the count div
        let cb = document.createElement("div");
        cb.classList.add("count");

        // Add the count number
        let cn = document.createElement("h1");
        cn.classList.add("count-number");
        cn.innerHTML = partyObj[key] + " " + key;


        // Add the count box to the count box container, insert the count number into count box, add party after count box
        c.appendChild(cb).appendChild(cn);
        delay += 1500
    }
}


// making boxes for each senator for full list
// pulls the following info from data letiable :
// name, party, state, gender, rank, office, DOB, start date, twitter ID, youtube ID, website link
function extractSenatorInfomation(senatorData) {
    // This list will contain all of the senator information
    let senatorInformationList = [];

    // Iterate through each senator
    for (let senatorInformation of senatorData) {
        let senator = {
            img: `https://www.govtrack.us/static/legislator-photos/${senatorInformation.person.link.slice(-6)}-200px.jpeg`,
            name: senatorInformation.person.name.slice(0, -6),
            party: senatorInformation.party,
            state: senatorInformation.state,
            gender: senatorInformation.person.gender_label,
            rank: senatorInformation.senator_rank_label, //This is needed for the filter function
            ["Rank: "]: senatorInformation.senator_rank_label, //This has the key in a more displayable format
            ["Office: "]: senatorInformation.office,
            ["DOB: "]: senatorInformation.person.birthday,
            ["Start Date: "]: senatorInformation.startdate,
            ["Twitter ID: "]: senatorInformation.person.twitterid,
            ["Youtube ID: "]: senatorInformation.person.youtubeid,
            websiteLink: senatorInformation.website,
            osid: senatorInformation.person.osid,
            ["age"]: (Math.abs(new Date(senatorInformation.person.birthday) - new Date()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2),
            firstname: senatorInformation.person.firstname
        };

        //filter null values
        for (let key in senator) {
            if (senator[key] == null) {
                delete senator[key];
            }
        }

        senatorInformationList.push(senator)
    }
    senatorInformationList.sort((a, b) => a.party.localeCompare(b.party));
    return senatorInformationList;
}

// Function for filtering the states in filter dropdown using search bar
// Adds "hide" class to any list items that don't match search
function searchStates() {
    // get the value from the search bar
    let search = document.getElementById("state-search-bar").value.toUpperCase();
    // Search dropdown
    let el = document.getElementById("state-dropdown");
    // Iterate over every state in the filter dropdown
    for (let option of el.children) {
        let id = option.getAttribute('id');
        if (id != "state-search" && id != "state-all" && (id.toUpperCase().indexOf(search) == -1)) {
            document.getElementById(id).classList.add("hide");
        } else {
            document.getElementById(id).classList.remove("hide");
        }
    }

}


// function to make senator list
function makeSenatorList(senators) {
    var senatorListEl = document.getElementById("senators")

    for (let senator of senators) {
        let senatorEl = document.createElement("div"); //<div class ="senator-box"></div>
        senatorEl.setAttribute("id", senator.osid);
        senatorEl.setAttribute("class", "senator-box");
        senatorEl.setAttribute("onclick", "toggleExtraInfo(this)"); //on click for the extra info dropdown 

        let mainInfoEl = document.createElement("div");
        mainInfoEl.setAttribute("class", "info");

        let extraInfoEl = document.createElement("div");  //creating extra_info div for the drop down section
        extraInfoEl.setAttribute("class", "extra_info");
        extraInfoEl.style.display = "none"; //hide div first

        let senatorMainEl = document.createElement("div"); //main_info div
        senatorMainEl.setAttribute("class", "main_info");

        Object.keys(senator).forEach(function (key) {
            let fieldEl = document.createElement("div"); //<div></div>

            // fieldEl.innerText = senator[key]; //<div>Tara</div>
            //creating website links
            if (key === "websiteLink") {
                let linkEl = document.createElement('a');
                linkEl.setAttribute('href', senator[key]);
                linkEl.setAttribute('target', '_blank');
                linkEl.textContent = 'Official Website';
                fieldEl.appendChild(linkEl);
            } else if (key === "img") {
                let img = document.createElement('img');
                img.src = senator[key];
                img.alt = "US Senator Image";
                fieldEl.appendChild(img);
            } else {
                fieldEl.innerText = key + " " + senator[key];
            }

            fieldEl.setAttribute("class", key); //adds class to the inner div

            //if key not img or extra info, adding to main_info div  
            // if info not key it is added to extra_info
            if (senator[key] === undefined || ["age", "osid", "firstname", "rank"].includes(key)) {
                // Do nothing
            }
            else if (!["name", "party", "state", "img", "gender"].includes(key)) {

                extraInfoEl.appendChild(fieldEl);
            }
            else if (key === "img") {
                senatorEl.appendChild(fieldEl);
            }
            else {
                fieldEl.innerText = senator[key];
                senatorMainEl.appendChild(fieldEl); //<div class ="senator-box"><div>Tara</div></div>
            }
        });
        senatorEl.appendChild(mainInfoEl);
        mainInfoEl.appendChild(senatorMainEl);
        mainInfoEl.appendChild(extraInfoEl);
        senatorListEl.appendChild(senatorEl);

    }

}

// function to create senior senator list 
// need to group by party 
function extractSeniorSenators(seniorData) {
    let seniorSenatorList = [];
    for (let seniorSenatorInfo of seniorData) {
        // filters the senators that have a leadership title 
        if (seniorSenatorInfo.leadership_title) {
            let seniorSenator = {
                title: seniorSenatorInfo.leadership_title,
                name: seniorSenatorInfo.person.name.slice(0, -6),
                party: seniorSenatorInfo.party,
            };
            seniorSenatorList.push(seniorSenator);
        }
    }
    seniorSenatorList.sort((a, b) => a.party.localeCompare(b.party));
    return seniorSenatorList;
}

function makeSeniorList(seniorSenators) {
    let seniorSenatorListEl = document.getElementById("leadership");

    for (const seniorSenator of seniorSenators) {
        let seniorSenatorEl = document.createElement("div");
        seniorSenatorEl.className = 'seniorSenator-box';
        Object.keys(seniorSenator).forEach(function (key) {
            let fieldEl = document.createElement("div");
            fieldEl.setAttribute("class", `leader${key}`); //inner div name 
            fieldEl.innerText = seniorSenator[key];
            if (key === "party") {
                fieldEl.innerText = "(" + fieldEl.innerText + ")";
            }
            seniorSenatorEl.appendChild(fieldEl);
        })
        seniorSenatorListEl.appendChild(seniorSenatorEl);
    }
}

//  Senator List Toggle
function toggleExtraInfo(senatorEl) {
    var extraInfoEl = senatorEl.getElementsByClassName("extra_info")[0];
    if (extraInfoEl.style.display === "none") {
        extraInfoEl.style.display = "block";
    } else {
        extraInfoEl.style.display = "none";
    }
}

// get all the filter names
// Returns a set object with all party names
function getFilterNames(data) {

    return {
        "party": Array.from(new Set(data["objects"].map(x => x["party"]))).sort().reverse(),
        "state": Array.from(new Set(data["objects"].map(x => x["state"]))).sort().reverse(),
        "gender": Array.from(new Set(data["objects"].map(x => x["person"]["gender_label"]))).sort().reverse(),
        "rank": Array.from(new Set(data["objects"].map(x => x["senator_rank_label"]))).sort().reverse(),
    };
}


// This function will take filters and insert them into each filter category
// Takes in filter object, with names = name of category (state, gender, etc) and values = set of options
function insertFilterOptions(filters) {
    // This function will create each individual filter box
    // Takes name and "All" box element name
    function makeFilterBox(name, grouping) {
        let allBox = document.getElementById(grouping + "-all");
        // create list item
        let el = document.createElement("li");
        el.setAttribute('id', name);
        el.classList.add("filter-list");
        el.onclick = () => toggleSelection(grouping, name);
        // create p tag for the text
        let p = document.createElement("p");
        p.innerHTML = name;
        // create p tag for the checkmark
        let pcheck = document.createElement("p");
        pcheck.innerHTML = "&check;";
        pcheck.classList.add("check-mark");
        pcheck.setAttribute("id", name + "-check");
        // insert elements
        allBox.after(el);
        el.appendChild(p);
        p.after(pcheck);
    }


    // Insert options

    for (let party of filters["party"]) {
        makeFilterBox(party, "party");
    }

    for (let state of filters["state"]) {
        makeFilterBox(state, "state");
    }

    for (let gender of filters["gender"]) {
        makeFilterBox(gender, "gender");
    }

    for (let rank of filters["rank"]) {
        makeFilterBox(rank, "rank");
    }


}


// This function toggles the dropdowns for filter boxes
// Takes tagID as string, toggles display on said box
function toggleDropdown(tagID) {
    document.getElementById(tagID).classList.toggle("hide");
}

// This function checks what's selected in the filter
// It takes in the filter grouping
// Goes through all the html elements in the filter dropdown and checks if the checkmark is hidden or not
function getSelectedFilters(grouping) {
    let children = document.getElementById(grouping + "-dropdown").children;
    let selectedList = [];
    for (const child of children) {
        if (child.id != grouping + "-all" && child.id != grouping + "-search") {

            let checked = document.getElementById(child.id + "-check").classList;
            if (!checked.contains("hide")) {
                selectedList.push(child.id);

            }
        }
    }
    return selectedList;
}

// This function writes the text below the filter ("selected: AK,AZ,....")
// This function takes in string grouping and list[str] selected
// grouping is the group that's being filtered by, e.g. state
// selected is a list of currently selected attributes for that grouping
function writeSelectedText(grouping, selected) {
    let text = document.getElementById(grouping + "-filter-text");

    if (selected.length === filters[grouping].length) {
        // write all
        text.innerHTML = "Selected: All";
    } else if (selected.length === 0) {
        text.innerHTML = "Selected: None";
    } else {
        // write a list of selected, x chars max
        let txt = "Selected: " + selected.join(", ");
        text.innerHTML = txt.slice(0, 20) + "...";
    }
}


// This function will run the necessary code for the selectAll
// Will take in grouping as string (either Part, State, or rank)
// Removes all of the filters for that grouping on all senators, unchecks all other boxes in that filter section
function selectAll(grouping) {
    // check if checkmark present for all box
    let isChecked = !document.getElementById(grouping + '-all-check').classList.contains("hide");

    if (isChecked) {
        // uncheck everything
        for (let tagID of filters[grouping]) {
            document.getElementById(tagID + "-check").classList.add("hide");
            for (let senator of senators) {
                let el = document.getElementById(senator.osid);
                el.classList.add(grouping + "-hide");
            }
        }
        writeSelectedText(grouping, []); //Empty because none selected

    } else {
        for (let tagID of filters[grouping]) {
            document.getElementById(tagID + "-check").classList.remove("hide");
            for (let senator of senators) {
                let el = document.getElementById(senator.osid);
                el.classList.remove(grouping + "-hide");
            }
        }
        writeSelectedText(grouping, filters[grouping]); //All filters for that grouping because everything selected
    }

    // Finally toggle check on all box
    document.getElementById(grouping + '-all-check').classList.toggle("hide");

}

// This filter will be invoked when an item in the dropdown list is selected/deselected
// function will toggle hide on the corresponding senators, the check mark
function toggleSelection(grouping, item) {
    // Toggle the checkmark on the filter tab
    let checkbox = document.getElementById(item + "-check");
    checkbox.classList.toggle("hide");
    // hide/unhide the senators in the senator list
    // Hiding is done by adding a "hide" class to the object
    // Each filter (state, gender, rank etc.) has its own hide class, 
    // This way we can remove filters without seeing what other filters are selected
    for (let senator of senators) {
        if (senator[grouping] === item) {
            let el = document.getElementById(senator.osid);
            el.classList.toggle(grouping + "-hide");
        }
    }
    let selected = getSelectedFilters(grouping);
    if (selected.length === filters[grouping].length) {
        // Make all tick visible
        document.getElementById(grouping + "-all-check").classList.remove("hide");
    } else {
        // make all tick invisible
        document.getElementById(grouping + "-all-check").classList.add("hide");
    }
    writeSelectedText(grouping, selected);

}
// End Filter Manipulation Functions

// Initialize filters and senat here so they are inside the scope of all the above functions
let filters;
let senators;
let partyObj;
let seniorSenators;

// Add event listener allows HTML to be loaded first before JS starts. Best practice
document.addEventListener("DOMContentLoaded", async () => {

    // Pull the data from JSON file
    const data = await getData();
    // object with party as key and count as value
    partyObj = countSenatorsByParty(data);


    // filter object with state, party, gender, rank, for insertion into filter boxes
    filters = getFilterNames(data);
    // Insert filter options
    insertFilterOptions(filters);

    //make senator list
    senators = extractSenatorInfomation(data.objects);
    makeSenatorList(senators);

    //make senior senator list
    // seniorSenator = extractSeniorSenators(data.objects);
    seniorSenators = extractSeniorSenators(data.objects);
    makeSeniorList(seniorSenators);

});

// Set the scrollY pos to 0 for use in the scroll event listener
let barChartCreated = false;
let titleScrolled = false;
let titlePage = document.getElementById("title-page");
let titleHeight = titlePage.scrollHeight;

// Scroll event listener
document.addEventListener("scroll", (event) => {
    let scrollY = window.scrollY;
    // First scroll, move the title up and make it sticky
    if (scrollY < titleHeight / 4 && !titleScrolled) {
        titleScrolled = true;
        // Move the title up and logo to the side
        let capitol = document.getElementById("capitol");
        let title = document.getElementById("title");
        titlePage.style.height = "15vh";
        titlePage.style.position = "sticky";
        titlePage.style.top = "0";
        capitol.style.top = "0vh";
        capitol.style.left = "5px";
        capitol.style.height = "100px";
        capitol.style.width = "100px";
        title.style.top = "5vh";


        // This function will create the bar chart
        if (!barChartCreated) {
            makeBarChart(partyObj);
            barChartCreated = true;
        }

    }

});

