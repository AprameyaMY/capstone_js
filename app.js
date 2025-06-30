// const heading = document.getElementById("h2heading");
// console.dir(heading);
// const p = document.createElement("p");
// p.textContent ="Hello after load";
// document.body.appendChild(p);
// const p1 = document.createElement("p");
// p1.textContent ="Hello after load";
// document.body.appendChild(p1);

let currentUser = null;
// let currentLoginUser = null;

const sections = {
    login: document.getElementById('login-section'),
    signup: document.getElementById('signup-section'),
    dashboard: document.getElementById('dashboard-section')
    // task
    // notes
};

function renderHeader() {
    const userInfo = document.getElementById("user-info");
    const logoutButton = document.getElementById("logout-btn");
    const desktopNavLinks = document.getElementById("desktop-nav");

    if(currentUser) {
        userInfo.textContent=currentUser.email;
        logoutButton.style.display="block";
        desktopNavLinks.querySelector("#nav-dashboard").style.display="inline"
        desktopNavLinks.querySelector("#nav-tasks").style.display="inline"//if # is removed here,#nav-notes still displayed
        desktopNavLinks.querySelector("#nav-notes").style.display="inline"
    } else {
        userInfo.textContent = "";
        logoutButton.style.display = "none";
        desktopNavLinks.querySelector("#nav-dashboard").style.display = "none"
        desktopNavLinks.querySelector("#nav-tasks").style.display = "none"
        desktopNavLinks.querySelector("#nav-notes").style.display = "none"
    }
    //implement logout
    logoutButton.addEventListener ('click',()=>{
        localStorage.removeItem('user');
        window.location.hash = '#login';
        currentUser =null;
        route();
        console.log(window.location.hash);
    });
}

// renderHeader();

// function renderSignUp(){
//     sections.signup.style.display = "block";
//     if (sections.signup.style.display == "block"){
//         sections.login.style.display ="none";
//     }
//     else{
//         sections.login.style.display ="block";
//     }
// }

// renderSignUp()

// function renderLogIn() {
//     // sections.login.style.display ="none";
//     if (sections.signup.style.display == "block"){
//         sections.login.style.display ="none";
//     }
//     else{
//         sections.login.style.display ="block";

//     }
// }


// renderLogIn()



// if(currentUser === null){
// // renderLogIn()
// renderSignUp()

// }

function initialize() {
    //signupHandler
    const signUpForm = document.getElementById('signup-form');
    signUpForm.addEventListener('submit', async (event) =>{
        event.preventDefault(); //prevents default behaviour
        //get the values
        const userName = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try{
            
            // const res = await fetch (`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const data =await res.json();
            if (data.length >0){
                throw new Error("Email Exists");
            }
            const createUser = await fetch ('http://localhost:3000/users',{
                method : 'POST',
                headers : { 'Content-Type': 'application/json'},
                body : JSON.stringify({userName,email,password})
            })
            const createdUser= await createUser.JSON;
            currentUser=createdUser;
            console.log("signup" ,currentUser);

            // save the curent user to local storage
            localStorage.setItem("user",JSON.stringify(currentUser));
            //show dashboard
            window.location.hash = "dashboard";
            route();
        } catch (err){
            document.getElementById('signup-errors').textContent = err.message;
        }

        //If a user exists by the same email
        //if a user not exist by the entered email
        //show him the dashboard
        // saving to local storage
        //create an entry
        // currentUser ={
        //     id:Date.now,
        //     userName,
        //     email,
        //     passwrod
        // }
        // localStorage.setItem("user",JSON.stringify(currentUser));
        // console.log(localStorage);
    });

    //login handler
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit',async (event)=>{
        event.preventDefault();
        // const userName = document.getElementById('login-username').value;
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try{
            const res =await fetch (`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.length === 0){
                throw new Error("Invalid Credentials")
            }

            const user = data.find(item => item.password ===password);
            currentUser =user;
            console.log("login",currentUser)
            localStorage.setItem *("user",JSON.stringify(currentUser));
            window.location.hash = 'dashboard';
            route();

        }catch(err){
            document.getElementById ('login-errors').textContent = err.message;
            console.log(err);
        }
        
        // currentUser ={
        //     email,
        //     password
        // }
        // localStorage.setItem("user",JSON.stringify(currentUser));
        // console.log(localStorage);    
    })
    //default handler User might already be logged in
    currentUser = localStorage.getItem('user');
    route();
    window.onhashchange =route; // this will store the function

    }


initialize();

function route (){
    const hash = window.location.hash || '#';
    // initial rendervalue of hash =#
    renderHeader();
    if (currentUser) {
        const page = hash.substring(1) || 'dashboard';
        showSections (page);
        switch (page) {
            case 'dashboard':
                // showSections('dashboard');
                renderDashboard();
                console.log('check the value hash');

             break;
            case 'tasks':
                renderTasks();
             break;
            case 'notes':
                renderNotes();
            default :
                // showSections('dashboard');
                // renderDashboard();
        }
    } else {
        if (hash === '#signup'){
            showSections('signup');
        } else {
            // showLogIn();
            showSections('login');
        }
    }

}

function showSections(name){
    //remove the "display:block" property from each section

    const values= Object.values(sections);
    console.log(values);
    values.forEach((item)=>{
        item.classList.remove('active')
    });
    //only add active property to currently visible section
    if (sections[name]){
        sections[name].classList.add('active')
    }
    console.log(values);

}

function renderDashboard(){
    // sections.dashboard.classList.add('active');
    sections.dashboard.innerHTML = `
        <h2> Welcome to your Dashboard </h2> <p>!!</p>
    `;
    // console.log(currentUser);
    setActiveNavLink();
}

function setActiveNavLink(){
    const hash= window.location.hash || "#dashboard" ;
    console.log(hash);

    const navLinks = {
        dashboard: document.getElementById("nav-dashboard"),
        tasks: document.getElementById("nav-tasks"),
        notes: document.getElementById("nav-notes")
    }
    const navData = Object.values(navLinks);
    navData.forEach((items)=>{
        items.classList.remove('active');
        if(hash.includes(items.getAttribute('href'))){
            items.classList.add('active');
        }
    });
    //  if (sections[name]){
    //     sections[name].classList.add('active')
    // }
    // console.log(navData);
}

function renderTasks(){
    // const hash= window.location.hash || "#dashboard" ;
    const tasks= document.getElementById("nav-tasks");
    tasks.classList.add('active');
    console.log(tasks);
}
function renderNotes(){
    // const hash= window.location.hash || "#dashboard" ;
    const notes= document.getElementById("nav-tasks");
    notes.classList.add('active');
    console.log(notes);
}