import React, { Component } from 'react';
import axios from 'axios';
import './index.css'
import dragElement from './dragElement'
import { openModal, closeModal } from './modal'
import { descMain, desc, descImpUrg, descImpNUrg, descNImpUrg, descNImpNUrg, instruction } from './description'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "", taskBoard: [], currentBoard: "", dispBoard: "", urgImp: [], urgNImp: [], nUrgImp: [], nUrgNImp: [], data: [], id: "", enteredID: "", loading: false
		}
		this.getData = this.getData.bind(this)
		this.addData = this.addData.bind(this)
		this.clearFields = this.clearFields.bind(this)
		this.deleteAction = this.deleteAction.bind(this)
		this.createProfile = this.createProfile.bind(this)
		this.createTaskBoard = this.createTaskBoard.bind(this)
		this.updateBoard = this.updateBoard.bind(this)
		this.findUser = this.findUser.bind(this)
		this.deleteBoard = this.deleteBoard.bind(this)
	}

	//create new user profile 
	createProfile() {
		let name = this.state.name
		if (!name.split(' ').join('')) alert('name field is empty');
		else {
			this.setState({ loading: true }, () => {
				async function createUser() {
					let res = await axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/putData', {
						name: name
					})
					return res
				}
				createUser()
					.then((res) => {
						console.log(res.data.data._id); setTimeout(() => {
							this.setState({ id: res.data.data._id, loading: false })
						}, 3000)
					})
			})
		}
	}

	// find existing user using userID
	findUser() {
		let id = (this.state.id) ? this.state.id : this.state.enteredID
		if (!id.split(' ').join('')) alert('userID field is empty');
		else {
			this.setState({ loading: true }, () => {
				async function retrieveUser() {
					let res = await axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/getUser', {
						id: id
					})
					return res
				}
				retrieveUser()
					.then((res) => {
						let userData = res.data.data
						if (userData) {
							let taskBoard = Object.keys(userData.task)
							console.log(res)
							setTimeout(() => {
								this.setState({ id: id, loading: false, name: userData.name, taskBoard: taskBoard, dispBoard: (taskBoard.length) ? taskBoard[0] : "", urgImp: (taskBoard.length) ? userData.task[taskBoard[0]].urgImp : [], urgNImp: (taskBoard.length) ? userData.task[taskBoard[0]].urgNImp : [], nUrgImp: (taskBoard.length) ? userData.task[taskBoard[0]].nUrgImp : [], nUrgNImp: (taskBoard.length) ? userData.task[taskBoard[0]].nUrgNImp : [] }, () => console.log(this.state.taskBoard))
							}, 3000)
						}
						else alert('no such userID!')
					})
			})
		}
	}

	// create new taskboard
	createTaskBoard() {
		let taskID = this.state.currentBoard
		let allTask = this.state.taskBoard
		let id = this.state.id
		console.log(taskID, allTask.filter(g => g == taskID).length)
		if (!taskID.split(' ').join('')) alert('task board name field is empty');
		else {
			if (this.state.taskBoard.filter(a => { return a == taskID }).length) alert('task board name already exists!');
			else {
				this.setState((state, props) => ({ taskBoard: state.taskBoard.concat(taskID), dispBoard: taskID, urgImp: [], urgNImp: [], nUrgImp: [], nUrgNImp: [] }), () => {
					axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addBoard', {
						id: id,
						taskID: taskID
					}); console.log(this.state.taskBoard); document.getElementById('taskBoard').value = taskID
				}
				)
			}
		}
	}

	//updata board when a different taskboard is selected
	updateBoard(e) {
		let taskID = e.target.value
		let id = this.state.id
		console.log('UPDATEB!!', taskID, id)
		async function retrieveBoard() {
			let res = await axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/getBoard', {
				id: id,
				taskID: taskID
			})
			return res
		}
		retrieveBoard()
			.then((res) => {
				let taskList = res.data.data.task[taskID]
				console.log(res.data.data); this.setState({ dispBoard: taskID, urgImp: taskList.urgImp, nUrgImp: taskList.nUrgImp, urgNImp: taskList.urgNImp, nUrgNImp: taskList.nUrgNImp })
			})
	}

	//get action item from modal window
	getData() {
		console.log("it gets to the function")
		const checkImp = document.querySelector('input[type=checkbox][name=imp]:checked')
		const checkUrg = document.querySelector('input[type=checkbox][name=urg]:checked')
		const checkDate = document.getElementById('deadline').value
		const now = new Date()
		let text = document.querySelector('textarea[name=actionItem]').value;
		if (!text.split(' ').join('')) alert('action item is empty');
		else {
			let important = (checkImp) ? checkImp.value : null
			let urgent = (checkUrg) ? checkUrg.value : null
			let dueDate = (checkDate) ? new Date(checkDate.replace(/-/g, '/')) : null
			console.log("imp: ", important, " urg: ", urgent, " duedate: ", dueDate, " diff: ", Math.abs(dueDate - now))
			let actionObj = { action: text, important: Boolean(important), urgent: Boolean(urgent), dueDate: dueDate }
			this.addData(actionObj)
			this.clearFields()
		}
	}

	//set state when new acton item is added
	addData(newItem) {
		console.log(this.state.disBoard)
		if (newItem.important && newItem.urgent) {
			this.setState((state, props) => ({ urgImp: [...state.urgImp, newItem] }), () => {
				axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
					id: this.state.id,
					taskID: this.state.dispBoard,
					taskObj: { urgImp: this.state.urgImp }
				})
			})


		}
		else if (newItem.important && !newItem.urgent) {
			this.setState((state, props) => ({ nUrgImp: [...state.nUrgImp, newItem] }), () => {
				axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
					id: this.state.id,
					taskID: this.state.dispBoard,
					taskObj: { nUrgImp: this.state.nUrgImp }
				})
			})
		}
		else if (!newItem.important && newItem.urgent) {
			this.setState((state, props) => ({ urgNImp: [...state.urgNImp, newItem] }), () => {
				axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
					id: this.state.id,
					taskID: this.state.dispBoard,
					taskObj: { urgNImp: this.state.urgNImp }
				})
			})
		}
		else if (!newItem.important && !newItem.urgent) {
			this.setState((state, props) => ({ nUrgNImp: [...state.nUrgNImp, newItem] }), () => {
				axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
					id: this.state.id,
					taskID: this.state.dispBoard,
					taskObj: { nUrgNImp: this.state.nUrgNImp }
				})
			})
		}
	}

	//clear modal window field
	clearFields() {
		document.querySelector('textarea[name=actionItem]').value = "";
		if (document.querySelector('input[type=checkbox][name=imp]:checked')) { document.querySelector('input[type=checkbox][name=imp]:checked').checked = false }
		if (document.querySelector('input[type=checkbox][name=urg]:checked')) { document.querySelector('input[type=checkbox][name=urg]:checked').checked = false; }
		document.getElementById('deadline').value = ""
	}

	//delete action item by setting state
	deleteAction(e) {
		let stateName = e.target.dataset.tagname
		let index = parseInt(e.target.dataset.position)
		console.log(typeof (index), stateName, [...this.state.nUrgNImp.slice(0, index), ...this.state.nUrgNImp.slice(index + 1)])
		switch (stateName) {
			case 'urgImp':
				this.setState((state, props) => ({ urgImp: [...state.urgImp.slice(0, index), ...state.urgImp.slice(index + 1)] })
					, () => {
						axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
							id: this.state.id,
							taskID: this.state.dispBoard,
							taskObj: { urgImp: this.state.urgImp }
						})
					})
				break;
			case 'urgNImp':
				this.setState((state, props) => ({ urgNImp: [...state.urgNImp.slice(0, index), ...state.urgNImp.slice(index + 1)] }), () => {
					axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
						id: this.state.id,
						taskID: this.state.dispBoard,
						taskObj: { urgNImp: this.state.urgNImp }
					})
				})
				break;
			case 'nUrgImp':
				this.setState((state, props) => ({ nUrgImp: [...state.nUrgImp.slice(0, index), ...state.nUrgImp.slice(index + 1)] }), () => {
					axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
						id: this.state.id,
						taskID: this.state.dispBoard,
						taskObj: { nUrgImp: this.state.nUrgImp }
					})
				})
				break;
			case 'nUrgNImp':
				this.setState((state, props) => ({ nUrgNImp: [...state.nUrgNImp.slice(0, index), ...state.nUrgNImp.slice(index + 1)] }), () => {
					axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/addTask', {
						id: this.state.id,
						taskID: this.state.dispBoard,
						taskObj: { nUrgNImp: this.state.nUrgNImp }
					})
				})
				break;
		}
	}

	// delete a given task board
	deleteBoard() {
		let id = this.state.id
		let taskID = this.state.dispBoard
		if (taskID) {
			async function delBoard() {
				let res = await axios.post('https://eisenhower-matrix-fullstack.glitch.me/api/deleteBoard', {
					id: id,
					taskID: taskID
				})
				return res
			}
			delBoard()
				.then((res) => {
					console.log('tries to find user')
					this.findUser()
				})
		}
	}

	// Make the DIV element draggable:
	componentDidMount() {
		document.getElementById("modal-header").addEventListener('click', dragElement(document.getElementById("modal")))
	}

	render() {
		return (
			<div id="prior">
				<div id="board">
					<div id='main-title'>The Eisenhower Matrix</div>
					{(this.state.id == "" && !this.state.loading) ? (<div id='userInfo'><b>For New Users ==>NAME:</b><input type="text" onChange={(e) => this.setState({ name: e.target.value })} placeholder="enter your name" /><button id="createUser" onClick={this.createProfile}>Create Profile</button><br /><br />
						<b>For returning Users ==>USERID:</b><input type="text" placeholder="enter userID" onChange={(e) => { this.setState({ enteredID: e.target.value }) }} /><button id="findUser" onClick={this.findUser}>Find My Profile</button>
					</div>) : ((this.state.loading) ? <div id='loading'>Creating/Retrieving Info!<br /> Please Wait...<br/>If this takes too long please hit refresh and try again. :)</div> : <div id="boardInfo">
						Hi <b>{this.state.name}!</b> Please Enter Your Task Board Name Below and Hit Create. <br /><br /> Keep this id to retrieve your task boards later: <b>{this.state.id}</b><br /><br />
						<b>TASK BOARD NAME:</b> <input type="text" onChange={(e) => this.setState({ currentBoard: e.target.value })} placeholder="ex. Work, Home, etc..." /><button id="newBoard" onClick={this.createTaskBoard}>Create a Task Board</button><br /><br />
						<b>Pick Existing Task Board:</b> <select name="taskBoard" id="taskBoard" ref="taskBoard" onChange={this.updateBoard}>
							{this.state.taskBoard.map(task => (
								<option value={task} key={task}>{task}</option>
							))}
						</select>
						<button onClick={this.deleteBoard}>Delete Current Board</button>
					</div>)}
					{(this.state.taskBoard.length) ? (<div id='taskB'>
						<div id="container">
							<div id="urgImp" className="tile">
								<div className="title">IMPORTANT & URGENT</div>
								<ul>{this.state.urgImp.map((item, i) =>
									<div key={"divurgImp" + i} className={((item.dueDate - (new Date())) > 0) ? "actionitem green" : (item.dueDate ? "actionitem red" : "actionitem blue")}>
										<li key={"urgImp" + i}>{item.action}</li><button data-tagname="urgImp" data-position={i} onClick={this.deleteAction}>&times;</button>
									</div>)}</ul>
							</div>
							<div id="nUrgImp" className="tile">
								<div className="title">IMPORTANT BUT LESS URGENT</div>
								<ul>{this.state.nUrgImp.map((item, i) =>
									<div key={"divnUrgImp" + i} className={((item.dueDate - (new Date())) > 0) ? "actionitem green" : (item.dueDate ? "actionitem red" : "actionitem blue")}>
										<li key={"nUrgImp" + i}>{item.action}</li><button data-tagname="nUrgImp" data-position={i} onClick={this.deleteAction}>&times;</button>
									</div>)}</ul>
							</div>
							<div id="urgNImp" className="tile">
								<div className="title">LESS IMPORTANT BUT URGENT</div>
								<ul>{this.state.urgNImp.map((item, i) =>
									<div key={"divurgNImp" + i} className={((item.dueDate - (new Date())) > 0) ? "actionitem green" : (item.dueDate ? "actionitem red" : "actionitem blue")}>
										<li key={"urgNImp" + i}>{item.action}</li><button data-tagname="urgNImp" data-position={i} onClick={this.deleteAction}>&times;</button>
									</div>)}</ul>
							</div>
							<div id="nUrgNImp" className="tile">
								<div className="title">LESS IMPORTANT & LESS URGENT</div>
								<ul>{this.state.nUrgNImp.map((item, i) =>
									<div key={"divnUrgNImp" + i} className={((item.dueDate - (new Date())) > 0) ? "actionitem green" : (item.dueDate ? "actionitem red" : "actionitem blue")}>
										<li key={"nUrgNImp" + i}>{item.action}</li><button data-tagname="nUrgNImp" data-position={i} onClick={this.deleteAction}>&times;</button>
									</div>)}</ul>
							</div>
						</div>
						<button target="#modal" id="action" onClick={openModal}>Add Action Item!!</button>
					</div>) : null}
				</div>
				<div id='description'>{descMain}{desc}{descImpUrg}{descImpNUrg}{descNImpUrg}{descNImpNUrg}{instruction}</div>
				<footer> <small>&copy; Copyright 2020, Dag Gebreselasse</small> </footer>
				<div id="modal" className="modal">
					<div className="modal-header" id="modal-header">
						<div className="title">Enter Action Item Below</div>
						<button id="close" className="close-button" onClick={closeModal}>&times;</button>
					</div>
					<div className="modal-body">
						<div id='action-section'>Action: <textarea placeholder="enter action item here" name="actionItem" required></textarea></div>
						<div id='imp-section'>Important? <input data-imp type="checkbox" name="imp" /></div>
						<div id='urg-section'>Urgent? <input data-urg type="checkbox" name="urg" /></div>
						<div>Due Date If Any: <input type='date' id='deadline' defaultValue={false} /></div>
						<button id='submit' onClick={this.getData} >ADD ACTION</button>
					</div>
				</div>
				<div id="overlay" onClick={this.closeModal}></div>
			</div>

		)
	}

}

export default App;