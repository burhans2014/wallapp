function MyFileReader() {
	
}

MyFileReader.prototype.read = function(path, callBack) {
	
	this.path = path;
	this.callBack = callBack;
	this.dirNames = this.path.split("/");
	this.fileName = this.dirNames[this.dirNames.length-1];
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.getRoot.bind(this), this.error.bind(this));
}

MyFileReader.prototype.getRoot = function(fileSystem) {

	this.root = fileSystem.root;
	this.currentDir = fileSystem.root;
	
	this.i = 0;
	this.currentDir.getDirectory(this.dirNames[this.i], {create: true, exclusive: false}, this.walkTree.bind(this), this.error.bind(this));	
}

MyFileReader.prototype.walkTree = function(directoryEntry) {

	this.currentDir = directoryEntry;
	
	if(this.i < (this.dirNames.length - 2)) {
	
		this.i += 1;
		this.currentDir.getDirectory(this.dirNames[this.i], {create: true, exclusive: false}, this.walkTree.bind(this), this.error.bind(this));
		
	} else {
	
		this.currentDir.getFile(this.fileName, {create: true, exclusive: false}, this.gotFileEntry.bind(this), this.error.bind(this));	
	}
}

MyFileReader.prototype.gotFileEntry = function(fileEntry) {

	fileEntry.file(this.gotFile.bind(this), this.error.bind(this));
}

MyFileReader.prototype.gotFile = function(file) {

	var reader = new FileReader();
	reader.onloadend = this.gotText.bind(this);
	reader.readAsText(file);
}

MyFileReader.prototype.gotText = function(evt) {

	this.callBack(evt.target.result);
}

MyFileReader.prototype.error = function() {

	alert("Error");
}

function MyFileWriter() {

}

MyFileWriter.prototype.write = function(path, data) {
	
	this.path = path;
	this.data = data;
	this.dirNames = this.path.split("/");
	this.fileName = this.dirNames[this.dirNames.length-1];
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.getRoot.bind(this), this.error.bind(this));
}

MyFileWriter.prototype.getRoot = function(fileSystem) {

	this.root = fileSystem.root;
	this.currentDir = fileSystem.root;
	
	this.i = 0;
	this.currentDir.getDirectory(this.dirNames[this.i], {create: true, exclusive: false}, this.walkTree.bind(this), this.error.bind(this));	
}

MyFileWriter.prototype.walkTree = function(directoryEntry) {

	this.currentDir = directoryEntry;
	
	if(this.i < (this.dirNames.length - 2)) {
	
		this.i += 1;
		this.currentDir.getDirectory(this.dirNames[this.i], {create: true, exclusive: false}, this.walkTree.bind(this), this.error.bind(this));
		
	} else {
	
		this.currentDir.getFile(this.fileName, {create: true, exclusive: false}, this.gotFile.bind(this), this.error.bind(this));	
	}
}

MyFileWriter.prototype.gotFile = function(fileEntry) {

	fileEntry.createWriter(this.gotWriter.bind(this), this.error.bind(this));
}

MyFileWriter.prototype.gotWriter = function(fileWriter) {

	fileWriter.write(this.data);
}

MyFileWriter.prototype.error = function() {

	alert("Error");
}
