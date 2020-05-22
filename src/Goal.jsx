import React from 'react';

export default class Goal extends React.Component {
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