fetch("./about.json")
.then(response => response.json())
.then(membersList => loadMembers(membersList));

function loadMembers(membersList) {
    var mainContainer = document.getElementById("about");
    for (member in membersList.members) {
        let name = membersList.members[member].name;
        let major = membersList.members[member].major;
        let imagesrc = membersList.members[member].imagesrc;
        let imagewidth = membersList.members[member].imagewidth;
        let imageheight = membersList.members[member].imageheight;
        let description = membersList.members[member].description;
        var memberDiv = document.createElement("div");
        memberDiv.className = "member";
        var imageDiv = document.createElement("div");
        imageDiv.className = "image";
        imageDiv.innerHTML = `<img src="${imagesrc}" width= "100%" height= "500px"></img>`
        var textDiv = document.createElement("div");
        textDiv.className = "text";
        textDiv.insertAdjacentHTML("beforeend",`
        <h2 style="strong">${name}</h2>
        <p>${major}</p>
        <p>${description}</p>`);
        memberDiv.appendChild(imageDiv); 
        memberDiv.appendChild(textDiv);     
        mainContainer.appendChild(memberDiv);
    }
}