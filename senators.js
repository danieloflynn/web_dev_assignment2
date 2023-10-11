console.log("hello");
document.addEventListener("DOMContentLoaded", async () => {
    
    
    // fetch data from the JSON file
    async function getData() {
        let data = await fetch("./senators.json");
        let json = await data.json();
        return json;

    }


    // Pull the data from JSON file
    const data = await getData();
    console.log(data);

});