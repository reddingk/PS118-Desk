
class characterModel {
    constructor(myName, myNav, myBody, myDesc){
        this.name = myName;
        this.images = ['character_full_silo/'+myName+'.png','character_thresh_silo/'+myName+'.png'];
        this.colorClass = myName+"_theme";
        this.description = myDesc;
        this.navComponent = myNav;
        this.bodyComponent = myBody;
    }
}

export default characterModel;