import React from 'react'

const descMain = <p style={{ 'font-size': '16pt' }}><b>Description:</b></p>
const desc = <p><b>The Eisenhower Matrix,</b> also referred to as Urgent-Important Matrix, helps you decide on and prioritize tasks by urgency and importance, sorting out less urgent and important tasks which you should either delegate or not do at all.<br /></p>
const descImpUrg = <p><b>Important & Urgent: </b>these are tasks you need to do first as they are both important and urgent.<br /></p>

const descImpNUrg = <p><b>Important But Urgent: </b>these are tasks you need to put in your calendar and plan to complete them by setting a deadline.<br /></p>
const descNImpUrg = <p><b>Less Important But Urgent: </b>these are tasks you need to delegate as they are less important to you but are still pretty urgent.<br /></p>
const descNImpNUrg = <p><b>Less Important & Less Urgent: </b>these are tasks you want to avoid doing but are there to help you sort out things that waste your time.<br /></p>
const instruction = <p><b>How to Use This Matrix: </b> Type your name and hit <b>Create Profile</b> then type in a name for your task board and hit <b>Create a Task Board</b> then click on <b>Add Action Item</b> button and type in a task. Check <b>important</b> and <b>urgent</b> boxs accordingly. You can also add a deadline for each task. This matrix will highlight the task <b style={{ 'color': 'green' }}>green</b> if the task is not due and highlight <b style={{ 'color': 'red' }}>red</b> if the task is due. If the task has no deadline assigned, it will show in <b style={{ 'color': 'grey' }}>grey</b>. When a task is completed you can click on the <b>&times;</b> button to remove it from the matrix.</p>

export {descMain, desc, descImpUrg, descImpNUrg, descNImpUrg, descNImpNUrg, instruction}