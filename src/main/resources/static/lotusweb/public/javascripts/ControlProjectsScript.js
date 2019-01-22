var project1 = { "Id" : "Project1", "Name" : "Project 1", "Data" : {"Component 1" : "1", "Component 2" : "2"} };
var project2 = { "Id" : "Project2", "Name" : "Project 2", "Data" : {"Component 1" : "1"} };

function ShowProject (project, id) {

	var DivProjects = document.getElementById("Elements");
	var RowProjects = DivProjects.querySelector(".row");

	var projects = info_manager.projects;

	var mainDiv = document.createElement("div");
	var componentDiv = document.createElement("div");
	var imgFolder = document.createElement("i");
	var label = document.createElement("label");
	var imgArrow = document.createElement("i");
	var imgAddComponent = document.createElement("i");

	var nameProject = project["Name"];

	mainDiv.setAttribute("class", "col-12 justify-content-center");
	componentDiv.setAttribute("class", "Components");
	componentDiv.style.display = 'none';
	imgFolder.setAttribute("id", id);
	imgFolder.setAttribute("class", "fas fa-folder-open");
	label.setAttribute("class", "ml-1");
	label.htmlFor = (id);
	label.textContent = nameProject;
	imgArrow.setAttribute("class", "fas fa-caret-right ml-1");
	imgArrow.setAttribute("onclick", "ShowComponents(event)");
	imgAddComponent.setAttribute("class", "far fa-plus-square col-12 addComponent ml-5");
	imgAddComponent.setAttribute("onclick", "NewComponent(event)");

	for ( key in project["Data"] ){

		var div = document.createElement("div");
		var imgComponent = document.createElement("i");
		var labelDiagram = document.createElement("label");

		var componentId = key.replace(" ","") + id;

		div.setAttribute("class", "col-12");
		div.setAttribute("onclick", "ShowSVGComponent(event)");
		imgComponent.setAttribute("id", componentId);
		imgComponent.setAttribute("class", "fas fa-sign-in-alt");
		labelDiagram.setAttribute("class", "ml-1");
		labelDiagram.htmlFor = componentId;
		labelDiagram.textContent = key;

		div.appendChild(imgComponent);
		div.appendChild(labelDiagram);
		componentDiv.appendChild(div);

		info_manager.projects[id].Data[key] = 
			{ 'svg_innerHTML' : project["Data"][key].svg_innerHTML, 
			'infoManager' : project["Data"][key].infoManager };

		info_manager.components[componentId] = 
			{ "idProject" : id, "name" : key };

	}

	componentDiv.appendChild(imgAddComponent);

	mainDiv.appendChild(imgFolder);
	mainDiv.appendChild(label);
	mainDiv.appendChild(imgArrow);
	mainDiv.appendChild(componentDiv);
	RowProjects.insertBefore(mainDiv, RowProjects.children[RowProjects.childElementCount-1]);

}

function ShowComponents (ev) {
	
	var divProject = ev.target.parentElement;

	if ( divProject.querySelector(".Components").style.display == 'none' ) {
		divProject.querySelector(".Components").style.display = 'initial';
		divProject.querySelectorAll("i[class*=fa-caret]")[0].className = "fas fa-caret-down ml-1";
	}else{
		divProject.querySelector(".Components").style.display = 'none';
		divProject.querySelectorAll("i[class*=fa-caret]")[0].className = "fas fa-caret-right ml-1";
	}

}

function NewProject (project) {
	
	var id = "Project" + Object.keys(info_manager.projects).length;

	if ( project.target != undefined){
		console.log("Novo");
		project = { "Name" : "NewProject", "Data" : {} };
	}

	info_manager.projects[id] = project;

	ShowProject(project, id);

}

function NewComponent (ev) {

	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var gSvg = document.createElementNS("http://www.w3.org/2000/svg", "g");
	var divComponents = ev.target.parentElement;
	var nameComponent = "Component " + divComponents.childElementCount;
	svg.id = "container_svg";
	svg.setAttribute("width", "2000px");
	svg.setAttribute("height", "2000px");
	gSvg.id = "startLines";
	svg.appendChild(gSvg);

	var id = ev.target.parentElement.parentElement.children[0].id;

	var componentId = ("Component" + divComponents.childElementCount) + id;

	var div = document.createElement("div");
	var imgComponent = document.createElement("i");
	var labelDiagram = document.createElement("label");

	div.setAttribute("class", "col-12");
	div.setAttribute("onclick", "ShowSVGComponent(event)");
	imgComponent.setAttribute("id", componentId);
	imgComponent.setAttribute("class", "fas fa-sign-in-alt");
	labelDiagram.setAttribute("class", "ml-1");
	labelDiagram.htmlFor = componentId;
	labelDiagram.textContent = nameComponent;

	div.appendChild(imgComponent);
	div.appendChild(labelDiagram);
	divComponents.insertBefore(div, divComponents.children[divComponents.childElementCount-1]);

	var RealWorkStation = document.getElementById("RealWorkStation");
	if ( RealWorkStation.childElementCount === 0 ){
		RealWorkStation.appendChild(svg);
	}else{
		RealWorkStation.removeChild(RealWorkStation.children[0])
		RealWorkStation.appendChild(svg);
	}

	var newInfoManager = new Info_Manager(svg.id);

	/*info_manager.projects[id].Data["Component " + divComponents.childElementCount] = 
		svg.innerHTML;*/
	info_manager.projects[id].Data[nameComponent] = 
		{ 'svg_innerHTML' : svg.innerHTML, 'infoManager' : newInfoManager };

	info_manager.components[componentId] = 
		{ "idProject" : id, "name" : nameComponent };
	
	newInfoManager.projects = info_manager.projects;
	newInfoManager.components = info_manager.components;
	newInfoManager.currentComponent = componentId;

	info_manager = newInfoManager;

}

function autoSaveSvg () {

	console.log("asdsf");
	
	function FuncAnim () {

		if ( info_manager.svg != undefined ){

			if ( info_manager.ModeAnimation != true ){

				console.log("Salvo");

				var componentId = info_manager.currentComponent;
				var idProject = info_manager.components[componentId].idProject;
				var componentName = info_manager.components[componentId].name;
				info_manager.projects[idProject].Data[componentName].svg_innerHTML = 
					info_manager.svg.innerHTML;
				info_manager.projects[idProject].Data[componentName].infoManager = 
					info_manager;

			}

		}

	}

	var anim = setInterval(FuncAnim, 5000);

}

function ShowSVGComponent (ev) {
	
	var componentId = ev.target.parentElement.children[0].id;

	var idProject = info_manager.components[componentId].idProject;
	var componentName = info_manager.components[componentId].name;

	var svg = info_manager.projects[idProject].Data[componentName].svg_innerHTML;

	/*console.log(componentId);
	console.log(idProject);
	console.log(componentName);
	console.log(svg);*/

	var newInfoManager = 
		info_manager.projects[idProject].Data[componentName].infoManager;

	newInfoManager.components = info_manager.components;
	newInfoManager.projects = info_manager.projects;

	info_manager = newInfoManager;

	UpdateEventsSvg(info_manager.projects[idProject].Data[componentName]);

	var initalState = document.getElementsByClassName("el_initial_state")[0];
	var finalStates = document.getElementsByClassName("el_final_state");

	info_manager.currentComponent = componentId;
	info_manager.initial_state = initalState.parentElement;
	info_manager.final_states = {};

	for ( var i = 0; i < finalStates.length; i++ ){
		/*console.log(finalStates[i]);
		console.log(finalStates[i].parentElement);*/
		info_manager.final_states[finalStates[i].parentElement.id] = 
			finalStates[i].parentElement;
	}


}

function loadProjectsForApiModel (ev) {

	console.log("Load");

	var modalBody = document.getElementById("modalApiDriveUpload").querySelector(".modal-body");
	var button = undefined;

	while ( modalBody.childElementCount != 0 ){

		modalBody.removeChild(modalBody.children[0]);

	}

	for ( key in info_manager.projects ){

		var project = info_manager.projects[key];

		button = document.createElement("button");
		button.className = "btn btn-outline-primary col-8 mt-2 " + key;
		button.setAttribute("data-dismiss", "modal");
		button.setAttribute("onclick", "UploadProjectDrive(event)");
		button.textContent = project.Name;

		modalBody.appendChild(button);

	}

}