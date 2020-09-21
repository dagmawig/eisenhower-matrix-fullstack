 //used to clear mondal window fields when the window is closed
 function clearFields() {
    document.querySelector('textarea[name=actionItem]').value = "";
    if (document.querySelector('input[type=checkbox][name=imp]:checked')) { document.querySelector('input[type=checkbox][name=imp]:checked').checked = false }
    if (document.querySelector('input[type=checkbox][name=urg]:checked')) { document.querySelector('input[type=checkbox][name=urg]:checked').checked = false; }
    document.getElementById('deadline').value = ""
}
 
//used to open modal window
 function openModal() {
    let modal = document.getElementById('modal')
    let overlay = document.getElementById('overlay')
    console.log(modal)
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}
//used to close modal window
function closeModal() {
    let modal = document.getElementById('modal')
    let overlay = document.getElementById('overlay')
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
    modal.style.top = 50 + "%"
    modal.style.left = 50 + "%"
    clearFields()
}

export {openModal, closeModal}