import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      goal: this.props.goalsArray.filter(res=>res.id===this.props.id)[0],
    };
  }

  editToggle() {
    this.setState({edit: !this.state.edit});
  }

  handleChange(e) {
    let updatedGoal = this.state.goal;
    updatedGoal.title= e.target.value;
    this.setState({goal: updatedGoal});
  }

  render() {
    let goal = this.state.goal;
    // console.log(goal);

    let subGoalsRec = [];
    goal.subGoals.forEach(goalId => {
      subGoalsRec.push(
        <Goal 
          key={goalId}
          id={goalId}
          goalsArray={this.props.goalsArray}
          action={(_id, f, options) => this.props.action(_id, f, options)}
        />
      );
    });

    let divGoal = (!this.state.edit ? (
      <div className="goal">
        <span>{goal.id+". "+goal.title} </span> <br/>
        {goal.openingDate.toLocaleDateString()} <br/>
        <button onClick={() => this.props.action(goal.id, "addNewGoal")}>Dodaj podcel</button> <br/>
        <button onClick={() => this.editToggle()}>Edytuj</button> <br/>
        {goal.id!==0 ? <button onClick={_id => this.props.action(goal.id, "deleteGoal")}>Usun</button> : null}
      </div>
    ) : (
      <div className="goal">
        {goal.id}. <input value={goal.title} onChange={e=>this.handleChange(e)} /> <br/>
        {goal.openingDate.toLocaleDateString()} <br/>
        <button onClick={() => {this.props.action(goal.id, "editGoal", goal); this.editToggle()}}>Zapisz</button>
          
      </div>
    ));


    return (
      <div className="group">
        {divGoal}
        <div className="sub">
          {subGoalsRec}
        </div>
      </div>
    );
  }
}

class App extends React.Component {
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
        }]
      }
    }
  }

action(_id, f, options) {

  let goalsCopy = this.state.map.goals;
  let chosenGoal = goalsCopy.filter(res=>res.id===_id)[0];
  switch(f) {
    case "addNewGoal": {
      let newGoal = {
        id: Math.max(...goalsCopy.map(item => Number(item.id)))+1,      //newGoal ma id o jedna wieksze od najwiekszego istniejacego
        title: 'Tytuł',
        subGoals: [],
        notes: [],
        complete: false,
        openingDate: new Date(),
      }
      
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
        if(subGoals.length) subGoals.forEach(item=> {recDelete(item)});
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
    console.log(this.state.map);
    return ( 
      <div className = "App" >
        <Goal 
          key={0}
          id={0}
          goalsArray={this.state.map.goals}
          action={(_id, f, options) => this.action(_id, f, options)}
        />
        

      </div>
    );
  }
}


ReactDOM.render(
  //<React.StrictMode>
    <App />,
  //</React.StrictMode>,
  document.getElementById('root')
);