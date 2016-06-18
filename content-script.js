console.log('content-script')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message && message.action === 'FETCH') {
    copyToClipboard(generateMarkdownFromSelection());
    console.log('copied');
  }
})

function generateMarkdownFromSelection() {
  // From tonyQ
  // Ref: https://gist.github.com/tony1223/478418a202e29fc16e17
  //

  function p2(text){
    return text < 10 ? "0"+text : text;
  }

  var p = window.getSelection();
  var content =  p.anchorNode.data.trim() || p.extentNode.data.trim() || p.anchorNode.innerText;
  var text = content.substring(p.anchorOffset,p.extentOffset);
  var container = getContainedNode(p.anchorNode);

  if(!container){
    alert("no contained comment or post");
  }

  var res = "", now = new Date();
  if(container.type == "comment"){
    var author = getCommentAuthor(container.node);
    var timenode = getCommentTimeNode(container.node)
    var link = timenode.parentNode;
    var time = new Date(parseInt(timenode.dataset.utime,10)*1000);

    var timezone = -1* (now.getTimezoneOffset()/60);

    res = ("# "+ author+
      "\n## articles" +
      "\n### "+
      time.getFullYear()+"/"+p2(time.getMonth()+1)+"/"+p2(time.getDate())+" "+
      p2(time.getHours())+":"+p2(time.getMinutes())+" GMT"+p2(timezone > 0 ? "+"+timezone :"-"+timezone)+":00"
      +" "+link.href+"\n- "+text);
  }else{
    var author = getPostAuthor(container.node);
    var timenode = getPostTimeNode(container.node);
    var link = timenode.parentNode;
    var time = new Date(parseInt(timenode.dataset.utime,10)*1000);

    var timezone = -1* (now.getTimezoneOffset()/60);

    res = ("# "+ author+
      "\n## articles" +
      "\n### "+
      time.getFullYear()+"/"+p2(time.getMonth()+1)+"/"+p2(time.getDate())+" "+
      p2(time.getHours())+":"+p2(time.getMinutes())+" GMT"+p2(timezone > 0 ? "+"+timezone :"-"+timezone)+":00"
      +" "+link.href+"\n- "+text);
  }

  return res;
}

/* ----------------------- */
/* DOM node access methods */
/* ----------------------- */

// Input: an HTML node
// Output:
//  {
//    type: "comment" or "post",
//    node: The containing node representing post or comment,
//  }
//
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

// Input: the comment node that contains the selected lines
// Output: (string) the name of the author
//
function getCommentAuthor(commentNode) {
  return commentNode.querySelectorAll(".UFICommentActorName")[0].innerText
}

// Input: the comment node that contains the selected lines
// Output: (Node) the time anchor node
//
function getCommentTimeNode(commentNode) {
  return commentNode.querySelectorAll("[data-utime]")[0];
}

// Input: the post node that contains the selected lines
// Output: (string) the name of the author
//
function getPostAuthor(postNode) {
  return (
    postNode.querySelectorAll("[aria-owns]")[0] ||
    postNode.querySelectorAll("[data-hovercard]")[1]
  ).innerText;
}

// Input: the post node that contains the selected lines
// Output: (Node) the time anchor node
//
function getPostTimeNode(postNode) {
  return postNode.querySelectorAll("[data-utime]")[0]
}

/* ----------------- */
/* Utility functions */
/* ----------------- */

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
