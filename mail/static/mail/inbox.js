
function initialize(){
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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
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