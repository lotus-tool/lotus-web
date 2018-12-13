var project1 = { "Name" : "Project 1", "Data" : {"Diagram 1" : "1", "Diagram 2" : "2"} };
var project2 = { "Name" : "Project 1", "Data" : {"Diagram 1" : "1"} };

info_manager.projects.push(project1);
info_manager.projects.push(project2);

function ShowProjects () {

	var DivProjects = document.getElementById("Elements");
	var RowProjects = DivProjects.querySelector(".row");

	while ( RowProjects.childElementCount != 0 ){
		RowProjects.removeChild(RowProjects.children[0])
	}

	var projects = info_manager.projects;

	for ( i in projects ){

		var mainDiv = document.createElement("div");
		var diagramDiv = document.createElement("div");
		var imgFolder = document.createElement("i");
		var label = document.createElement("label");

		var nameProject = projects[i]["Name"];

		mainDiv.setAttribute("class", "col-12 justify-content-center");
		diagramDiv.setAttribute("class", "Diagrams");
		imgFolder.setAttribute("id", ("Project"+i));
		imgFolder.setAttribute("class", "fas fa-folder-open");
		label.setAttribute("class", "ml-1");
		label.htmlFor = ("Project"+i)
		label.textContent = nameProject;

		for ( key in projects[i]["Data"] ){

			var div = document.createElement("div");
			var imgDiagram = document.createElement("i");
			var labelDiagram = document.createElement("label");

			div.setAttribute("class", "col-12");
			imgDiagram.setAttribute("id", (key+i));
			imgDiagram.setAttribute("class", "fas fa-sign-in-alt");
			labelDiagram.setAttribute("class", "ml-1");
			labelDiagram.htmlFor = (key+i);
			labelDiagram.textContent = key;

			div.appendChild(imgDiagram);
			div.appendChild(labelDiagram);
			diagramDiv.appendChild(div);

		}

		mainDiv.appendChild(imgFolder);
		mainDiv.appendChild(label);
		mainDiv.appendChild(diagramDiv);
		RowProjects.appendChild(mainDiv);

	}

}