    const apiUrl = "https://api.github.com/repos/Plugin-Warp/Plugin-Warp.github.io/contents/extensions";
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
            
            const data = await fetchrepocontents("https://api.github.com/repos/Plugin-Warp/Plugin-Warp.github.io/contents/" + path)
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
