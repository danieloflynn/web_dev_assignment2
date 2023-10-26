// fetch data from the JSON file
// adding error check function
async function getData() {
    let json;
    try {
        // try block 
        let data = await fetch("./senators.json");
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
    catch(error){
        document.getElementById("div").innerText = "Error: " + error.message;
    }

    return json;
 

}

// count senators by party
// returns an object with party as key and count as value
function countSenatorsByParty(data) {
    let partyCount = {};

    for (let senator of data.objects) {
        if (!partyCount[senator.party]) {
            partyCount[senator.party] = 0;
        }
        partyCount[senator.party] += 1;
    }
    return partyCount;
}

// This function will make the bar chart on top of the count boxes
function makeBarChart(partyObj) {

    // Get total senators
    let totalSenators = 0;
    for (key in partyObj) {
        totalSenators += partyObj[key];
    }



    // loop that creates boxes for each party and sizes/colours them accordingly
    for (key in partyObj) {
        let el = document.createElement("div");
        el.classList.add("bar");
        el.classList.add(key);
        el.setAttribute("style", "width: " + partyObj[key] * 100 / totalSenators.toString() + "vw")
        document.getElementById("bar-chart").appendChild(el)

    }

}

// Make boxes for the count of senators by party
// Takes object with parties as keys and number of senators as value
function makePartyBoxes(partyObj) {

    for (let key in partyObj) {

        // Make the count box
        let cb = document.createElement("div");
        cb.classList.add("count");
        cb.setAttribute("id", key + "-party");

        // Add the count number
        let cn = document.createElement("h1");
        cn.classList.add("count-number");
        cn.innerHTML = partyObj[key];


        // Add the party name
        let cp = document.createElement("h2");
        cp.classList.add("count-party");
        cp.innerHTML = key;

        // Add the count box to the count box container, insert the count number into count box, add party after count box
        document.getElementById("count-boxes").appendChild(cb).appendChild(cn).after(cp);

    }
}

// making boxes for each senator for full list
// pulls the following info from data letiable :
// name, party, state, gender, rank, office, DOB, start date, twitter ID, youtube ID, website link

function extractSenatorInfomation(senatorData) {
    //make sort by ranking & party 

    let senatorInformationList = [];

    for (let senatorInformation of senatorData) {
        let senator = {
            name: senatorInformation.person.name,
            party: senatorInformation.party,
            state: senatorInformation.state,
            gender: senatorInformation.person.gender_label,
            rank: senatorInformation.senator_rank_label,
            office: senatorInformation.office,
            DOB: senatorInformation.person.birthday,
            startDate: senatorInformation.startdate,
            twitterID: senatorInformation.person.twitterid,
            youtubeID: senatorInformation.person.youtubeid,
            websiteLink: senatorInformation.website,
            osid: senatorInformation.person.osid
        };
        senatorInformationList.push(senator)
    }
    return senatorInformationList;
}

// Search function for states
// Adds "hide" class to any list items that don't match search
function searchStates() {
    let search = document.getElementById("state-search-bar").value.toUpperCase();
    let el = document.getElementById("state-dropdown");
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
        var senatorEl = document.createElement("div"); //<div class ="senator-box"></div>
        senatorEl.setAttribute("id", senator.osid);
        senatorEl.setAttribute("class", "senator-box");
        senatorEl.setAttribute("onclick", "toggleExtraInfo(this)"); //on click for the extra info dropdown 
        
        var extraInfoEl = document.createElement("div");  //creating extra_info div for the drop down section
        extraInfoEl.setAttribute("class", "extra_info"); 
        extraInfoEl.style.display ="none"; //hide div first
       
        Object.keys(senator).forEach(function (key) {
            let fieldEl = document.createElement("div"); //<div></div>

            fieldEl.innerText = senator[key]; //<div>Tara</div>
            fieldEl.setAttribute("class", key); //adds class to the inner div
            
            // if info not key it is added to extra_info
            if (key !== "name" && key !== "party" && key !== "state") {
                extraInfoEl.appendChild(fieldEl); 
                senatorEl.appendChild(extraInfoEl);
            }
            else{
                senatorEl.appendChild(fieldEl); //<div class ="senator-box"><div>Tara</div></div>
            }
        })
        senatorListEl.appendChild(senatorEl)
    }

}

// function to create senior senator list 
// need to group by party 
function extractSeniorSenators(seniorData){
    let seniorSenatorList = [];
    // console.log(seniorData)
    for (let seniorSenatorInfo of seniorData){
        // filters the senators that have a leadership title 
        console.log(seniorSenatorInfo)
        if (seniorSenatorInfo.leadership_title) {
            let seniorSenator = {
                title: seniorSenatorInfo.leadership_title,
                name: seniorSenatorInfo.person.name.slice(0,-6),
                party: seniorSenatorInfo.party,
            };
            seniorSenatorList.push(seniorSenator);
        }
    }
     // Sort the list by party
    seniorSenatorList.sort((a, b) => a.party.toLowerCase() > b.party.toLowerCase() ? 1 : -1);
    
    return seniorSenatorList;
}

function makeSeniorList(data){
    let seniorSenators = extractSeniorSenators(data);
    let seniorSenatorListEl = document.getElementById("leadership");

    for (const seniorSenator of seniorSenators){
        let seniorSenatorEl = document.createElement("div");
        seniorSenatorEl.className = 'seniorSenator-box';
        Object.keys(seniorSenator).forEach(function (key){
            let fieldEl = document.createElement("div");
            fieldEl.innerText = seniorSenator[key];
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



// Start Filter Creation/Manipulation Functions
// This 


// get all the filter names
// Returns a set object with all party names
// TODO: Change this to take the set from senatorList instead of the raw data
function getFilterNames(data){

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
        el.onclick = () => { toggleSelection(grouping, name) };
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
    // TODO: put the for loop into the makeFilterBox function

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
// Initialize filters and senators here so they are inside the scope of all the above functions
let filters;
let senators;
// Add event listener allows HTML to be loaded first before JS starts. Best practice
document.addEventListener("DOMContentLoaded", async () => {

    // Pull the data from JSON file
    const data = await getData();
    // object with party as key and count as value
    const partyObj = countSenatorsByParty(data);
    // This function will create the bar chart
    makeBarChart(partyObj);
    // Make the boxes with the count per party
    makePartyBoxes(partyObj);
    // filter object with state, party, gender, rank, for insertion into filter boxes
    filters = getFilterNames(data);
    // Insert filter options
    insertFilterOptions(filters);

    //make senator list
    senators = extractSenatorInfomation(data.objects);
    makeSenatorList(senators);

    //make senior senator list
    // seniorSenator = extractSeniorSenators(data.objects);
    makeSeniorList(data.objects);

});