const api = "http://127.0.0.1:5000";

window.onload = () => {
    // BEGIN CODE HERE
    document.getElementById("searchButton").addEventListener("click", this.searchButtonOnClick)
    document.getElementById("submit").addEventListener("click", this.productFormOnSubmit)

//    const postReqButton = document.getElementById("submit");
//    postReqButton.onclick = productFormOnSubmit;
    // END CODE HERE
}

searchButtonOnClick = () => {
    // BEGIN CODE HERE
    const getSearch = document.getElementById("search")
    const res = new XMLHttpRequest()
    res.open("GET", `${api}/search?name=${getSearch.value}`)
    res.onreadystatechange = () => {
        if (res.readyState == 4) {
            if (res.status == 200) {
                // console.log(res.responseText);
                let table = document.querySelector(".search-results").children[0]

                //delete previous results
                let rows = document.querySelectorAll("tr")
                for (let i=1; i<rows.length; i++){
                    table.removeChild(rows[i])
                }

                let response = res.responseText
                response = response.replaceAll("'",'"')
                let my_list = JSON.parse(response)
                let my_dict = {}
                my_list.forEach((value, index) => {
                  my_dict[index.toString()] = value
                });

                //console.log(resText)
                let num = Object.keys(my_dict).length //number of results, returned by request

                // Convert object entries to an array
                let entries = Object.entries(my_dict);

                // Sort the array based on "price" value of each entry
                entries = entries.sort((a, b) => b[1].price - a[1].price);

                // Convert the sorted array back to an object
                //resText = Object.fromEntries(entries);
                //console.log(resText);

                //create new row and add data
                for (let i = 0; i < num; i++) {
                    let new_line = document.createElement("tr")
                    for (let i = 0; i < 6; i++) {
                        new_line.appendChild(document.createElement("td"))
                    }
                    new_line.children[0].innerHTML = entries[i][1]["id"]
                    new_line.children[1].innerHTML = entries[i][1]["name"]
                    new_line.children[2].innerHTML = entries[i][1]["production_year"]
                    new_line.children[3].innerHTML = entries[i][1]["price"]
                    new_line.children[4].innerHTML = entries[i][1]["color"]
                    new_line.children[5].innerHTML = entries[i][1]["size"]
                    table.appendChild(new_line)
                }
            }
        }
    };
    res.send();
    // END CODE HERE
}

productFormOnSubmit = (event) => {
    // BEGIN CODE HERE
    var nameValue = document.getElementById("name").value;
    var yearOfProductionValue = document.getElementById("production_year").value;
    var priceValue = document.getElementById("price").value;
    var colorValue = document.getElementById("color").value;
    var sizeValue = document.getElementById("size").value;

    if(nameValue.trim() != "" && yearOfProductionValue.trim() != "" && priceValue.trim() != "" && colorValue.trim() != "" && sizeValue.trim() != ""){
        const res = new XMLHttpRequest()
        res.open("POST", `${api}/add-product`) //?name=${nameValue}&production_year=${yearOfProductionValue}&price=${priceValue}&color=${colorValue}&size=${sizeValue}

        res.onreadystatechange = () => {
            if (res.readyState == 4) {
                if (res.status == 200) {
                    alert(res.responseText);
                }
            }
        };

        res.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        res.send(JSON.stringify({
            "name": nameValue,
            "production_year": yearOfProductionValue,
            "price": priceValue,
            "color": colorValue,
            "size": sizeValue
        }));
    }
    else{
        alert("Empty values!");
    }

    // END CODE HERE
}
