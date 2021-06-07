import React, { Component } from 'react'
import {Button,Modal} from 'react-bootstrap'
import "./todotasks.css"

export class ToDoTasks extends Component {    
    constructor(props) {
        var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        super(props)
    
        this.state = {
            show:false,
            todoList:[],
            activeItem:{
                id:null,
                title:'',
                description:'',
                completed:false,
                startdate: date,
                enddate:date,
            },
            editing:false,      
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleChange = this.handleChange.bind(this) 
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        
    }
    // modal popup create task
    setModal(){
        this.setState({show: !this.state.show})
    };
   

   
    //  fetch data 
   fetchData(){
        fetch("https://djapitodo.herokuapp.com/tasks/")
        .then(response => response.json())
        .then(data => {
          this.setState({
            todoList:data 
        })
    })
    };


    // mount data
    componentDidMount(){
        this.fetchData()
    }

   //cerf token cookie 
   getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//  handele chaange field 
handleChange(e){
    var target = e.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    var name = target.name;
    // console.log('Name:', name)
    // console.log('Value:', value)
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        [name]: value
      }
    })
  }
//   submit data
  handleSubmit(e){
    var csrftoken = this.getCookie('csrftoken')
    if(this.state.editing === true){
    fetch(`https://djapitodo.herokuapp.com/tasks/${ this.state.activeItem.id}/`,{
        method:"PUT",
        body:JSON.stringify(this.state.activeItem),
        headers:{
        'content-type':'application/json',
        'X-CSRFToken':csrftoken,
        }
    })  
  
    window.location.reload()
}else{
        fetch("https://djapitodo.herokuapp.com/tasks/",{
        method:"POST",
        body:JSON.stringify(this.state.activeItem),
        headers:{
        'content-type':'application/json',
        'X-CSRFToken':csrftoken,
        }
        // reset form field 
    }).then(()  => {
        this.fetchData()
        this.setState({
           activeItem:{
          id:null, 
          title:'',
          completed:false,
          description:'',
          startdate:'',
          enddate:''
        }
        })
    })
    window.location.reload()
}
  }
   

    //   edit task
    startEdit(task){
        this.setState({
          activeItem:task,
          editing:true,
          show:true,
        })
      }
    //   delete 
    handleDelete = (task) => {
        fetch(`https://djapitodo.herokuapp.com/tasks/${task.id}/`,{
           method:"DELETE",
          body:JSON.stringify(this.state),
          headers:{
          'content-type':'application/json',
          }
          }).then(() => {
          this.fetchData()
      })
    }
    render() {
        const tasks = this.state.todoList;
        const {show} =this.state
        
        const     colors = [
            {
                primaryColor : "#5D93E1",
                secondaryColor : "#ECF3FC"
            },
            {
                primaryColor : "#5DC250",
                secondaryColor : "#F2FAF1"
            },
            {
                primaryColor : "#F9D288",
                secondaryColor : "#FEFAF1"
            },
            
            {
                primaryColor : "#F48687",
                secondaryColor : "#FDF1F1"
            },
            {
                primaryColor : "#B964F7",
                secondaryColor : "#F3F0FD"
            }
        ]
  
        return (
            <div>
                <div className = "header text-center">
                    <h3>Todo List</h3>
                    <button className = "btn btn-primary mt-2  addtask" onClick={()=>this.setModal()} >add task</button>
                </div>
                <div  className = "task-container">
                {tasks.map((task ,index)=>{
                    return(
                        <div key={index} className = "card-wrapper mr-5">
                            <div className = "card-top" style={{"backgroundColor": colors[index%5].primaryColor}}></div>
                            <div className = "task-holder">
                                    <span className = "card-header titleheading" style={{"backgroundColor": colors[index%5].secondaryColor, "borderRadius": "10px"}}>
                                     {task.title}
                                    </span>
                                    <p className = "descheading mt-1" >{task.description}</p>
                                    <div style={{"position": "absolute", "left" : "10px", "bottom" : "10px", }} >
                                        { task.completed === false?
                                        <i className="fa fa-clock-o" style = {{"color" : colors[index%5].primaryColor, "cursor" : "pointer"}}> &nbsp;&nbsp;&nbsp; {task.startdate}</i>
                                        :
                                        <i  className = "fa fa-check "  style = {{"color" : colors[index%5].primaryColor, "cursor" : "pointer"}} >&nbsp;&nbsp;&nbsp;{task.enddate}</i>
                                        }
                                    </div>
                                    <div style={{"position": "absolute", "right" : "10px", "bottom" : "10px"}}>
                                        <i   onClick={() => this.startEdit(task)} className = "far fa-edit mr-3" style={{"color" : colors[index%5].primaryColor, "cursor" : "pointer"}} ></i>
                                        <i onClick={() => this.handleDelete(task)} className="fas fa-trash-alt" style = {{"color" : colors[index%5].primaryColor, "cursor" : "pointer"}}></i>
                                    </div>
                            </div>
                        </div>
                    )
                })}

                </div>

                {/* add data */}
                <Modal show={show} >
                <Modal.Header >
                <Modal.Title>Create Task</Modal.Title>
                </Modal.Header >
                <Modal.Body>              
                <div className = "form-group">
                    <label>Task Name</label>
                    <input onChange={this.handleChange}   className="form-control" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                </div>
                <div className = "form-group">
                    <label>Description</label>
                    <textarea  onChange={this.handleChange}   rows = "4" className = "form-control" value={this.state.activeItem.description} name = "description" placeholder="Add Description"></textarea>
                </div>
                <div className = "form-group" >
                    <label>Start Date &nbsp;&nbsp;:&nbsp;</label>
                    <input onChange={this.handleChange}  type='date' className = "form-control" value={this.state.activeItem.startdate} name="startdate" />
                </div>
                <div className = "form-group" >
                    <label>Date of Completion </label>
                    <input onChange={this.handleChange}  type='date'className = "form-control" value={this.state.activeItem.enddate} name="enddate" />
                </div>
                <div className = "form-group" >
                    <label>Completed &nbsp;&nbsp;&nbsp; </label>
                    <input onChange={this.handleChange}   type='checkbox' checked={this.state.activeItem.completed} name="completed" />
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>this.setModal()}>Cancel</Button>
                <Button variant="primary" onClick={()=>this.handleSubmit()}>Add Task</Button>
               </Modal.Footer>             
            </Modal>
            </div>
        )
    }
}
export default ToDoTasks
