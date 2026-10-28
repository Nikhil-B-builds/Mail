
function initialize(){
  


    const form = document.querySelector('#compose-form');
    

    form.addEventListener('submit', function(event) {
        
        event.preventDefault();
        console.log('Form submited!')
        send_mail()
    });



   // Use buttons to toggle between views}
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  console.log('1 done ')
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
}

function compose_email() {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  clear()
}
  // Clear out composition fields
function clear(){
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
}

  



function send_mail(){
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    console.log(recipients);
    console.log(subject);
    console.log(body);
    clear()
     fetch('/emails',{
      method:'POST',
      body : JSON.stringify({
        recipients:recipients,
        subject:subject,
        body:body,
      })
     })

     .then(response => response.json())
     .then(result => {
         console.log(result);
     });

    console.log("success ")

}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  
  fetch(`/emails/${mailbox}`)
  .then(response =>  response.json())
  .then(emails => {
    console.log(emails);
    App(emails)
    
    function Mail(props){
      return (
        <div id='Mail-element'>
          <b>{props.sender_name}</b> {props.subject}
             <t id='time'>{props.time}</t>
          
        </div>
        
         
      );
    }


    function App () {
    
      return(
        
          <div>
            
            
            <h1>{mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h1>
            
             <div id="emails-all">
              
                  {emails.map(element => (
                      <Mail sender_name={element.sender_name} subject={element.subject} 
                      time={element.timestamp} 
                      />
                  ))}
            </div>
          </div>
        
       );
       
      
    }
   
    ReactDOM.render(<App />,document.querySelector('#emails-view'))

  })
 
}
 
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded',initialize);

} else {
  initialize()
}