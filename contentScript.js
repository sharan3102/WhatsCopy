console.log("This is content script")

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function expandContent(messageElement) {
    
    const readMoreButton = messageElement.querySelector('.read-more-button');
    const contentSpan = messageElement.querySelector('._11JPr.selectable-text.copyable-text');
    if(readMoreButton){
        readMoreButton.click();    
        setTimeout(function() {
            const expandedContent = contentSpan.textContent; 
            console.log('Expanded content:', expandedContent);
            return expandedContent;
        }, 100);
    }
    else{
        return;
    }
}


function addCopyIconToMessages(message){
            
    // create new button
    let copyButton;
    // get container
    const iconContainer = message.querySelector('.tvf2evcx.m0h2a7mj.lb5m6g5c.j7l1k36l.ktfrpxia.nu7pwgvd.p357zi0d.dnb887gk.gjuq5ydh.i2cterl7.FxqSn');
    
    // add button to icon container
    // iconContainer.contains(copyButton);
    if(iconContainer && !iconContainer.querySelector('.copy-button')){

        copyButton = document.createElement('button');
        copyButton.classList.add('copy-button');

        // add same class of reaction button
        const classes = 'tvf2evcx m0h2a7mj lb5m6g5c j7l1k36l ktfrpxia nu7pwgvd dnb887gk gjuq5ydh i2cterl7 rqm6ogl5 i5tg98hk folpon7g przvwfww snweb893'.split(' ')
        classes.map(className => {
            copyButton.classList.add(className)
        });
        
        // adding icon
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" /><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" /></svg>';
        copyButton.style.display = 'none';
        iconContainer.appendChild(copyButton);
        console.log("------------BUTTON ADDED----------------");
        
        // add event listener to the copy button
        copyButton.addEventListener('click', () => {

            // get message element
            const copyableText = message.querySelector('span.copyable-text > span');
            let messageText = ''

            if(copyableText){

                console.log(copyableText);
                if(message.querySelector('.read-more-button')){
                    messageText = expandContent(message);
                    console.log(messageText);
                }
                else{
                    messageText = copyableText.textContent.trim();
                    console.log(messageText);
                }

            }

            // copy the message text to clipboard
            if (messageText) {
                copyToClipboard(messageText);

                // set user feedback
                copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                
                // revert the icon to normal one
                setTimeout(() => {
                    copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" /><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" /></svg>';
                }, 1500);
            }

        });

        message.addEventListener('mouseover', () => {
            copyButton.style.display = 'block';
        });

        // toggle button
        message.addEventListener('mouseout', () => {
            copyButton.style.display = 'none';
        });

        
    }
    else{
        console.log("<<<<<<< Button Already exists >>>>>>>>>"); 
    }
}

function getNewMessages(){

    console.log("Running Mutation Observer !!!");
    console.log("Looking for New Messages -------------->");

    const newMessage = document.querySelector('.n5hs2j7m.oq31bsqd.gx1rr48f.qh5tioqs');

    if(newMessage){
        const observer = new MutationObserver((messageList, observer) => {
            messageList.forEach((message) => {
                if( message.type === 'childList'){
                    message.addedNodes.forEach((renderedMessage) => {
                        if(renderedMessage.getAttribute('role') === 'row'){
                            // console.log(`New Message Element ${renderedMessage.textContent}`);

                            // somehow added copybutton logic
                            addCopyIconToMessages(renderedMessage);
                        }
                    });
                }
            });
        });

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(newMessage,config);
    }
    else{
        console.log("Not found");
    }
    
}

const chatListDiv = document.querySelector('div[aria-label="Chat list"]');

chatListDiv.addEventListener('click', () => {
    console.log("Moved to a new Chat !!!!");
    getNewMessages();
    // get messages
    const messages = document.querySelectorAll('.message-in, .message-out');
    // console.log(messages);
    messages.forEach((message) => {
        addCopyIconToMessages(message);
    });
});