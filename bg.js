chrome.contextMenus.create({
  title: 'Copy to clipboard in Debater format',
  contexts: ['selection'],
  onclick: handleContextMenuClick
})

function handleContextMenuClick(info, tab) {
  chrome.tabs.sendMessage(tab.id, {action: 'FETCH'}, {}, resp => {
    console.log('context menu', resp)
  })
}
