securigo = {};

(function (securigo) {

    securigo.getCompanyName = (function () {
        setInterval(function () {
            var name = $('.company-input').val();
            securigo.getCompanyDataOnLoad(name);
            //securigo.requestCompanyData(name);
        }, 1000)

    })();

    securigo.getCompanyDataOnLoad = function (name) {

        $.ajax({
            url: 'get_data',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({name: name}),
            dataType: 'json',
            success: function (data) {
                console.log(data)
            }
        })

    };

    securigo.requestCompanyData = function (name) {

        $.ajax({
            url: 'https://www.linkedin.com/ta/federator?types=company&query=' + name,
            type: 'get',
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function (data) {
                var dat = data['company']['resultList'];

                securigo.sortData(dat);
            }
        })
    };

    securigo.saveData = function (data){

        var companyObj = {
            companies: data
        };

        $.ajax({
            url: '/save',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(companyObj),
            dataType: 'json',
            success: function (data) {

            }
        })

    };
    securigo.sortData = function (data) {
        var companyList = [];
        $.each(data, function(i, v){
            if (v['imageUrl']){
                if (!(_.contains(companyList, v))){
                    var company = new CompanyProfile(v['displayName'], v['imageUrl'], v['subLine'],
                        v['id'], v['url']);
                    companyList.push(company);
                }
            }
        });

        securigo.saveData(companyList);
        securigo.arrangeCompaniesToDisplay(companyList);
    };

    securigo.arrangeCompaniesToDisplay = function (companyList) {
        var companyListToDisplay = [];
        $.each(companyList, function (i, v){
            var companyToDisplay = new CompanyToDisplay(v['name'], v['imageUrl'], v['url']);
            companyListToDisplay.push(companyToDisplay);
        });
        securigo.createAutocomplete(companyListToDisplay);
    };


    securigo.createAutocomplete = function (companyList) {

        com = companyList;
        $('.company-input').autocomplete({
            appendTo: '.autocomplete-result',
            source: companyList
        });

        $('.company-input').data('ui-autocomplete')._renderItem = function (ul, item){
            var inner_html = '<div class="list_item_container"><div class="label"><img src="' + item.image + '">' +
                '</div><div class="image">' + item.label + '</div></div>';
            return $('<li></li>')
                .data("item.autocomplete", item)
                .append(inner_html)
                .appendTo(ul)
        };
    };

})(securigo);

function CompanyProfile(name, link, subline, id, url){
    this.name = name;
    this.imageUrl = link;
    this.subLine = subline;
    this.id = id;
    this.url = url;
}

function CompanyToDisplay(name, image, url){
    this.label = name;
    this.image = image;
    this.value = url;
}





//securigo.createAutocomplete = function (companyList) {
//    console.log(companyList);
//    com = companyList;
//    $('.company-input').autocomplete({
//        appendTo: '.autocomplete-result',
//        source: function (request, response){
//            $.ajax({
//                url: 'https://www.linkedin.com/ta/federator?types=company&query=' + companyList,
//                type: 'get',
//                dataType: 'jsonp',
//                jsonp: 'callback',
//                success: function (data) {
//                    var d = data['company']['resultList'];
//                    securigo.sortData(d);
//                    response(($.map(d, function (item){
//                        return {
//                            label: item['displayName'] + " " +  $('<img>', {src: item['imageUrl']})
//                        }
//
//                    })));
//                }
//            });
//        },
//        _renderItem: function (ul, item) {
//            return $('<li></li>')
//                .data('img-value', item.value)
//                .append('<img src=' + item.label + '/>')
//                .appendTo(ul)
//        }
//    });
//
//};

