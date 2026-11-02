
function initialize(){
  


    const form = document.querySelector('#compose-form');
    

    form.addEventListener('submit', function(event) {
        
        initialize_composing(event)
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
  document.querySelector("#email-view").style.display='none';
  document.querySelector('#compose-recipients').required = true;
  document.querySelector('#compose-subject').required = true;
  document.querySelector('#compose-body').required = true;
  clear()
}

async function initialize_composing(Event){
  const recipients = document.querySelector('#compose-recipients');
  const subject = document.querySelector('#compose-subject');  
  const body = document.querySelector('#compose-body');
  const currentuseremail = document.querySelector('#user-data').dataset.email;

        
        console.log(recipients.value);
        console.log(subject.value);
        console.log(body.value);
        
        Event.preventDefault();
        if (recipients.value.trim() === '' || subject.value.trim() == '' || 
            body.value.trim() === ''){
              alert("plz fill out all the field's");
        }else {
        
              console.log('Form submitted!')
              const response = await Send_mail(recipients.value, subject.value, body.value);
              if (response.status === 400 ){
                recipients.value = '';
                alert(response.result);
              }else{
                console.log('#success');
                clear();
                load_mailbox('sent')
              }
        };
}



  // Clear out composition fields
function clear(){
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
}




async function Send_mail(recipients,subject,body){
    

    const result =   await fetch('/emails',{
      method:'POST',
      body : JSON.stringify({
        recipients:recipients,
        subject:subject,
        body:body,
      })
     })
    const status = result.status;
    const result_1 = await result.json();
    console.log(status,result_1)
    return ({
         status: status,
         result: result_1.error
       });
    

}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#email-view").style.display='none';

  
  fetch(`/emails/${mailbox}`)
  .then(response =>  response.json())
  .then(emails => {
    console.log(emails);
    
    
    function Mail({mail}){
      function handle_click(){
        open_mail(mail.id)
        fetch(`/emails/${mail.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        
        });
      }
      
      return (
        <div onClick={handle_click}className={`Mail-element ${mail.read ? 'Mail-element-read':""}`}>
            <b>{mail.sender_name}</b> {mail.subject}
            <t id="time">{mail.timestamp}</t>
        </div>
      );
    }


    function App() {
       
      if (emails.length === 0 ){
        return (
          <div>
           <h1>{mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h1>
           <div id='Empty-text'>
               <h3>No emails</h3>
           </div>
        </div>
        );
      };
      
     
         
       return(
        
          <div>
            <h1>{mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h1>
            
            
               <div id="email">
              
                  {emails.map(element => (
                      <Mail mail={element} 
                      />
                  ))}
                  
            </div>
          </div>
        
       );
       
      
    }
    
    ReactDOM.render(<App />,document.querySelector('#emails-view'));
    
    
  })

function open_mail(email_id){
  console.log(email_id);
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#email-view").style.display='block';
  

  fetch(`/emails/${email_id}`)
  .then(response=> response.json())
  .then(email => {
    console.log(email);
    



    function App(){
      
        return (
          
          <div id='Mail-body'>
            <b>From : </b> {email.sender}<br />
           <b>Subject : </b> {email.subject} <br />
           <b>Timestamp : </b> {email.timestamp}<br />
           <button class='btn btn-sm btn-outline-primary'>Reply</button>
           <hr />
           {email.body}

          </div>
        )
    }

    ReactDOM.render(<App />,document.querySelector('#email-view'));
  });
}
 
}


 
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded',initialize);

} else {
  initialize()
}