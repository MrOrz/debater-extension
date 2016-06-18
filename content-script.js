
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message && message.action === 'FETCH') {
    copyToClipboard(generateMarkdownFromSelection());
    console.log('copied');
  }
})

function copyToClipboard(text) {
  // Ref: https://gist.github.com/joeperrin-gists/8814825
  //

  const textarea = document.createElement('textarea');
  textarea.style.position = 'fixed';
  textarea.style.opacity = 0;
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('Copy');
  document.body.removeChild(textarea);
};

function generateMarkdownFromSelection() {
  // From tonyQ
  // Ref: https://gist.github.com/tony1223/478418a202e29fc16e17
  //

  function p2(text){
    return text < 10 ? "0"+text : text;
  }
  function getContainedNode(node){
    var p = node;
    while(p){
      if(p && p.classList){

        if(p.classList.contains("UFIComment")){
          return {type:"comment",node:p};
        }

        if(p.classList.contains("userContentWrapper")){
          return {type:"post",node:p};
        }
      }
      p = p.parentNode;
    }
    return null;
  }

  var p = window.getSelection();
  var content =  p.anchorNode.data.trim() || p.extentNode.data.trim() || p.anchorNode.innerText;
  var text = content.substring(p.anchorOffset,p.extentOffset);
  var container = getContainedNode(p.anchorNode);

  console.log(text);
  if(!container ){
    alert("no contained comment or post ");
  }

  var res = "",now = new Date();
  if(container.type == "comment"){
    var author = container.node.querySelectorAll(".UFICommentActorName")[0].innerText;
    var timenode = container.node.querySelectorAll("[data-utime]")[0];
    var link = timenode.parentNode;
    var time = new Date(parseInt(timenode.dataset.utime,10)*1000);

    var timezone = -1* (now.getTimezoneOffset()/60);

    res = ("# "+ author+
      "\n## articles" +
      "\n### "+
      time.getFullYear()+"/"+p2(time.getMonth()+1)+"/"+p2(time.getDate())+" "+
      p2(time.getHours())+":"+p2(time.getMinutes())+" GMT"+p2(timezone > 0 ? "+"+timezone :"-"+timezone)+":00"
      +" "+link.href+"\n- "+text);
    console.log("# "+ author+"\n### "+time+"\n"+link.href+"\n-"+text);
  }else{
    var author = (
      container.node.querySelectorAll("[aria-owns]")[0] ||
      container.node.querySelectorAll("[data-hovercard]")[1]
    ).innerText;
    var timenode = container.node.querySelectorAll("[data-utime]")[0];
    var link = timenode.parentNode;
    var time = new Date(parseInt(timenode.dataset.utime,10)*1000);

    var timezone = -1* (now.getTimezoneOffset()/60);

    res = ("# "+ author+
      "\n## articles" +
      "\n### "+
      time.getFullYear()+"/"+p2(time.getMonth()+1)+"/"+p2(time.getDate())+" "+
      p2(time.getHours())+":"+p2(time.getMinutes())+" GMT"+p2(timezone > 0 ? "+"+timezone :"-"+timezone)+":00"
      +" "+link.href+"\n- "+text);
    console.log("# "+ author+"\n### "+time+"\n"+link.href+"\n-"+text);
  }

  console.log(res);
  return res;
}
