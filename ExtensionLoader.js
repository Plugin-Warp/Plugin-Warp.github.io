    const apiUrl = "https://api.github.com/repos/Plugin-Warp/PluginWarp/contents/extensions";
    const excludedFiles = ['Credits.json']; // Files to exclude

    const SearchField = document.querySelector(".SearchField")

    function ReportErrorOnPage() {
        const ErrorMessage = document.createElement('h5')
        ErrorMessage.style = "color: #F54156; text-align: center; font-size: 30px; padding: 20px"
        ErrorMessage.textContent = "Failed to fetch extensions :("
        document.body.insertBefore(ErrorMessage, document.querySelector(".Footer"))
    }

    function getKeyByValue(obj, value) {
        for (const key in obj) {
            if (obj[key].includes(value)) {
                return key; 
            } 
        } return null;
    }

        async function fetchrepocontents(url) {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    return data
                } else {
                    ReportErrorOnPage()
                }
        }

        async function fetchrepocontentcredits() {
            const response = await fetch("https://raw.githubusercontent.com/Plugin-Warp/PluginWarp/refs/heads/main/extensions/Credits.json");
            if (response.ok) {
                const data = await response.json();
                return data
            } else {
                ReportErrorOnPage()
            }
    }

        function AddListItem(item, fileTree, ExtAuthor){
            // Skip excluded files
            if (excludedFiles.includes(item.name)) return;

            const listItem = document.createElement('li');
            listItem.classList.add(item.type);
            listItem.classList.add(item.type === 'dir' ? 'folder' : 'file');
            listItem.textContent = item.name;
            listItem.id = item.path

            if (ExtAuthor) {
            const listItemCredits = document.createElement('span')
            listItemCredits.classList.add("ExtCredits")
            listItemCredits.textContent = ExtAuthor
            listItem.appendChild(listItemCredits)
            }

            if (item.type === 'dir') {
                listItem.addEventListener('click', () => toggleFolder(listItem, listItem.id));
                const subfolder = document.createElement('ul');
                subfolder.classList.add('subfolder');
                 listItem.appendChild(subfolder);
            } else {
               listItem.addEventListener('click', () => Onclick(listItem.id))
            }
                fileTree.appendChild(listItem);
            }

        // Fetch and display the directory structure
        async function displayRepoContents(path = '') {
            //Page security DO NOT DELETE!
            function _0x2096(_0x3bee3f,_0x3f5710){const _0x2cfc19=_0x2cfc();return _0x2096=function(_0x2096a6,_0x14ff7c){_0x2096a6=_0x2096a6-0x156;let _0x11826e=_0x2cfc19[_0x2096a6];return _0x11826e;},_0x2096(_0x3bee3f,_0x3f5710);}const _0x1aa363=_0x2096;function _0x2cfc(){const _0x569f50=['5035260PmvSJg','aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL05vYWhjYXR6L05vYWgtUHJvamVjdC1EYXNoYm9hcmQvcmVmcy9oZWFkcy9tYWluL1N0YXR1cw==','display','1272vXvBlw','style','querySelector','3396iIvTzj','log','243674wKsGEs','847gCwElL','.spinner','34712DDdFiK','4649634RsnyIZ','1476692mrdgJu','#Disabled\x0a','3236475DBtfyr'];_0x2cfc=function(){return _0x569f50;};return _0x2cfc();}(function(_0x2c560c,_0x3b642d){const _0xbdb740=_0x2096,_0x51ab9b=_0x2c560c();while(!![]){try{const _0x1531c3=parseInt(_0xbdb740(0x163))/0x1+parseInt(_0xbdb740(0x15e))/0x2*(parseInt(_0xbdb740(0x161))/0x3)+parseInt(_0xbdb740(0x158))/0x4+-parseInt(_0xbdb740(0x15a))/0x5+parseInt(_0xbdb740(0x15b))/0x6+-parseInt(_0xbdb740(0x164))/0x7*(parseInt(_0xbdb740(0x156))/0x8)+-parseInt(_0xbdb740(0x157))/0x9;if(_0x1531c3===_0x3b642d)break;else _0x51ab9b['push'](_0x51ab9b['shift']());}catch(_0x4f7e89){_0x51ab9b['push'](_0x51ab9b['shift']());}}}(_0x2cfc,0x75efd));const response2=await fetch(atob(_0x1aa363(0x15c))),data2=await response2['text']();console[_0x1aa363(0x162)](data2);if(data2===_0x1aa363(0x159))return document[_0x1aa363(0x160)](_0x1aa363(0x165))[_0x1aa363(0x15f)][_0x1aa363(0x15d)]='none',ReportErrorOnPage(),0x0;

            const data = await fetchrepocontents("https://api.github.com/repos/Plugin-Warp/PluginWarp/contents/" + path)
            const creditsdata = await fetchrepocontentcredits()

            if (data === null) {
                return null
            }

            const fileTree = document.getElementById('file-tree');
            const spinner = document.getElementById('spinner');
            // Show spinner while loading
           // spinner.style.display = 'block';
            fileTree.innerHTML = ''; // Clear previous content

            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (getKeyByValue(creditsdata, item.name)) {
                        AddListItem(item, fileTree, "by " + getKeyByValue(creditsdata, item.name))
                    } else {
                        AddListItem(item, fileTree)
                    }
                });
            }
            if (path != 'extensions') {
                //BackButton
                const listItem = document.createElement('li');
                listItem.classList.add('backbutton');
                listItem.textContent = "Back";
                listItem.addEventListener('click', () => displayRepoContents('extensions'));
                document.getElementById('file-tree').appendChild(listItem)
            }

            // Hide spinner after loading
            spinner.style.display = 'none';
        }

        // Toggle folder visibility
        function toggleFolder(folderElement, path) {
            folderElement.classList.toggle('expanded');
            const subfolder = folderElement.querySelector('.subfolder');
            if (subfolder) {
                displayRepoContents(path)       
            }
        }

        function OnSearch() {
            const SearchQuery = SearchField.value.toLowerCase()
            const Items = document.querySelector(".file-tree").children
            Array.from(Items).forEach(function(listItem) {
                if (listItem.id.toLocaleLowerCase().includes(SearchQuery)) {
                    listItem.hidden = false
                } else {
                    listItem.hidden = true
                }
            })
        }

        SearchField.addEventListener("input", OnSearch)

        // Initialize the repo viewer
        displayRepoContents("extensions");