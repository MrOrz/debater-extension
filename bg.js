chrome.contextMenus.create({
  title: 'Copy to clipboard in Debater format',
  contexts: ['selection'],
  onclick: handleContextMenuClick
})

function handleContextMenuClick(info, tab) {
  chrome.tabs.sendMessage(tab.id, {action: 'FETCH'}, resp => {
    if(resp.status === 'SUCCESS') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: './debater-logo.png',
        title: 'Debater editor tool',
        message: resp.message,
      })
    } else {
      alert(resp.message)
    }
  })
}
