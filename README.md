# COMP30680 Web Application Development Assignment 2 : JavaScript and JSON

## Quick notes on using GitHub


**Never push to main.** 

Each feature should be its own branch, which then gets pulled to main via pull request.

When starting a new feature:
1. Create new branch.

While working on feature
2. write and save code.

3. Stage files.

4. Commit changes. 

5. push to feature branch on github periodically.

When feature is done:

6. Create pull request from main branch.

7. Other person reviews and approves pull request.


### Creating a new branch

To create a new branch:
```git checkout -b new_feature```

You can check what branch you are on by typing:
```git branch```

**Make sure you're not pushing to main**

### Staging changes

Before committing changes, you have to stage them using git add

```git add filename.abc```

use "." instead of filename to stage everything

### Committing changes

To commit changes

```git commit filename.abc -m "Commit message goes here" ```

or just use "." instead of filename for everything

### Pushing to github

To push to github:

```git push -u origin feature_branch```

### Creating pull requests from main branch

Easiest to do this on github.

Go into main branch.

Pull requests --> new pull request --> pick your branch.

### Reviewing and approving pull requests

Should be ok unless there's a conflict?


# Assignment

This assignment focuses on the use of JavaScript to read, manipulate, and present JSON data in a webpage.  The data for the assignment is taken from [www.govtrack.us/](http://www.govtrack.us/). It provides information on members of the US  Senate. The data is contained in the file 'senators.json'.

Your job is to present the JSON data on a webpage. To do this you will need to combine HTML, CSS, and JavaScript. Other languages are not permitted. The use of JavaScript frameworks (e.g. jQuery) is not  permitted.

Note: All steps outlined below can be achieved without the need to reload the page or navigate to a new  page. If your solution involves reloading the page or navigating to a new page (with the exception of  external websites in step 4) two grade points will be deducted from your final mark (e.g., A+ to A-).

Note: all information needed to create the lists and filters below is available in the json file. Two grade points  (e.g., A+ to A-) will be deducted if information is hardcoded, instead of being read from the json data. For example, the information needed to identify leadership roles, or to create a list of US statesor political parties is available in the json data.

## Requirements:

1. Creating a webpage called senators.html. When this page is opened it should show the following:
- The total number of senators in each party affiliation, e.g., Democrats: 66
- A list of all senators with leadership roles, using the following format:
- Senate Minority Leader: Chuck Schumer (Democrat)
- Senate Minority Leader: Mitch McConnell (Republican)
- Leadership roles should be grouped by party. E.g., list all Democrats with leadership roles first.
1. Next, the webpage should display all senators, with the following information given for each senator: party, state, gender, rank.
2. senators.html should provide a way to filter the senators in step 2 above by:
- Filter senators by party (with 'show all' as the default option).
- Filter senators by state (with 'show all' as the default option).
- Filter senators by rank (with 'show all' as the default option).
- These filters can be implemented in a number of ways, e.g. using dropdown menus. It should be possible to combine filters, e.g. filter by party and state. Where senators from different parties are shown (e.g. when the party filter is set to 'show all') they should be grouped by party.
1. senator.html should also allow the user to choose a senator and view more detailed information on this senator. Once chosen the following information should be presented for the selected senator:
- Office
- Date of birth
- Start date
- Twitter and YouTube id where available.
- Clickable website link. When clicked this link should open in a new tab.

## Marking

This assignment is worth 50% of the total module mark. You will receive an overall grade for the assignment. In determining the grade, the following weighting will be used:

a. 25%: for implementing the functionality described in step 1 above.

b. 10%: for implementing the functionality described in step 2 above.

c. 25%: for implementing the functionality described in step 3 above.

d. 30%: for implementing the functionality described in step 4 above.

e. 10%: overall impression and quality of the overall design. For example, have you included appropriate and effective error handing? Is the information presented in a clear and uncluttered manner? Does  the website make appropriate use of HTML, CSS, and JavaScript.

## Submitting

Submit a single zip file using BrightSpace. The zip file should include a folder containing your webpage and any associated files.

Please name your zip file using the following format: "GroupNo_Firstname_Lastname_A2_COMP30680.zip". The deadline for submission is listed on BrightSpace under assignment 2.

Viewing the JSON data

To get an initial overview of the data in the JSON query, it is helpful to view it in a JSON viewer such as the  one available at http://jsonviewer.stack.hu/. This will give you a tree like view of the data.

Code validation:

Your webpage should be consistent with the HTML5 and CSS3 standards.

Code reuse

The webpage must be your own work. Any code snippets that are not directly written by you (e.g. used from  a tutorial) must be referenced as such within your code. You must directly comment the code to explain its source. Failure to reference code that is not yours will be treated as plagiarism.

Due on 06 November 2023 11:59 PM




