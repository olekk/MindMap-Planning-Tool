import React from 'react';

import ViewControl from './ViewControl.jsx'
import Goal from './Goal.jsx'

export default class MindMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: {
        goals: [{
          id: 0,
          title: 'Spełnienie',
          subGoals: [],
          notes: [],
          complete: false,
          openingDate: new Date(),
          x: 0,
          y: 0,
        }]
      },
      view: {
        zoom: 1,
        y: 0,
        x: 0,
        }
    }
  }

componentDidUpdate() {
  // let viewEl = document.getElementById("view");
  // viewEl.addEventListener('scroll', this.handleScroll);
  // viewEl.scrollLeft = 2500-viewEl.innerWidth/2;
  // viewEl.scrollTop = 2500-viewEl.innerHeight/3;
}

viewControl(f) {
  let newView = this.state.view;

  let act = function(that) {
    switch(f) {
      case '+': {
        if(newView.zoom<2) newView.zoom*=1.01;
      break; }
      case '-': {
        if(newView.zoom>0.1) newView.zoom*=0.99;
      break; }
      case '<': {
        if(newView.x<2000) newView.x+=2;
      break; }
      case '>': {
        if(newView.x>-2000) newView.x-=2;
      break; }
      case 'up': {
        if(newView.y<2000) newView.y+=2;
      break; }
      case 'down': {
        if(newView.x>-2000) newView.y-=2;
      break; }
      default : {
      }
    }
    that.setState({view:newView});
  }

  let stop = function() {
    clearInterval(interval);
    document.body.removeEventListener('mouseup', stop);
  }

  act(this);
  let interval = setInterval(()=>{act(this)}, 10);
  document.body.addEventListener('mouseup', stop);
  
}

blankGoal(_id) {
  return {
    id: _id,
    title: 'Tytuł',
    subGoals: [],
    notes: [],
    complete: false,
    openingDate: new Date(),
    x: 0,
    y: 0,
  }
}

action(_id, f, options) {

  let goalsCopy = this.state.map.goals;
  let chosenGoal = goalsCopy.filter(res=>res.id===_id)[0];
  switch(f) {
    case "addNewGoal": {
      let newGoal = this.blankGoal(Math.max(...goalsCopy.map(item => Number(item.id)))+1);
      
      chosenGoal.subGoals.push(newGoal.id);
      goalsCopy.push(newGoal);
      this.setState({map: {goals: goalsCopy}});
    break; }

    case "editGoal": {
      chosenGoal.title=options.title;

    break; }

    case "deleteGoal": {
      let toDelete = [];
      function recDelete(id) {
        toDelete.push(id);
        let subGoals = goalsCopy.filter(res=>res.id===id)[0].subGoals;
        if(subGoals.length) subGoals.forEach(item=> {recDelete(item)});       //rekursywne dodawanie wszystkich id potomnych początkowego
        else return;
      };
      recDelete(_id);
      goalsCopy = goalsCopy.filter(res=>!toDelete.includes(res.id));
      goalsCopy.forEach(e=>{                 //usuwanie _id z subGoals wszystkich elementow ktore go mają
        e.subGoals = e.subGoals.filter(res=>res!==_id);
      })

      this.setState({map: {goals: goalsCopy}});
    break; }

    default: {

    }
  }

}

  render() {
    return ( 
      <div className = "view" >
        <div className="mindmap" style={{transform: "translate("+this.state.view.x+"px, "+this.state.view.y+"px) scale("+this.state.view.zoom+")"}}>
          <Goal 
            key={0}
            id={0}
            goalsArray={this.state.map.goals}
            action={(_id, f, options) => this.action(_id, f, options)}
          />
        </div>
        <ViewControl 
          viewControl={(f)=> this.viewControl(f)}
          zoom={this.state.view.zoom}
        />
      </div>
    );
  }
}
