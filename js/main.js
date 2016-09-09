$(function() {
    (function initTable() {
        $('.sort').each(function(i, elem) {
            var department = elem.dataset['department'],
                len = applicants[department].length,
                index = 0,
                str = ''
            while (index++ < len) {
                str += '<tr><td>' + index + '</td><td class="applicant"></td></tr>';
            }
            $('.table', $(elem.parentElement)).html(str)
        })
    }());

    (function initLocalStorage() {
        if (!localStorage.getItem('drawLot')) {
            var drawLot = {
                db: $('.table',$('.db')).html(),
                lt: $('.table',$('.lt')).html(),
                hq: $('.table',$('.hq')).html(),
                gh: $('.table',$('.gh')).html(),
                cs: $('.table',$('.cs')).html(),
                tj: $('.table',$('.tj')).html(),
                jx: $('.table',$('.jx')).html(),
            }
            localStorage.setItem('drawLot', JSON.stringify(drawLot))
        }
    }())


    var swapData = {}

    $('#drawLot').on('click', ".btn", function(e) {
        var targetElem = e.target,
            department = targetElem.dataset['department']
        swapData['department'] = department
        swapData['parentElem'] = targetElem.parentElement
        if(targetElem.innerHTML === '重新排序'){
            $('#myModal').modal('show')
        }
        if (targetElem.innerHTML === '开始排序') {
            displayResult(department, targetElem.parentElement)
            writeLocalStorage(department)
            targetElem.innerHTML = '重新排序'
        }
    })
    $('.btn-success', $('#myModal')).click(function() {
        displayResult(swapData['department'], swapData['parentElem'])
        writeLocalStorage(swapData['department'])
        $('#myModal').modal('hide')
    })

    function displayResult(department, parentElem) {
        var duplicate = _.cloneDeep(applicants[department]),
            length = duplicate.length,
            result = []
        while (length) {
            result.push(duplicate.splice(_.random(0, --length), 1)[0])
        }
        var str = '',
            len = result.length,
            index = 0
        while (index++ < len) {
            str += '<tr><td>' + index + '</td><td class="applicant">' + result[index - 1] + '</td></tr>'
        }
        $('.table', parentElem).html(str)
    }

    function writeLocalStorage(department) {
        var drawLot = JSON.parse(localStorage.getItem('drawLot'))
        drawLot[department] = $('table', $('.' + department)).html()
        localStorage.setItem('drawLot', JSON.stringify(drawLot))
    }

    // 恢复对话框相关操作
    $('#drawLot').on('dblclick', '.panel-heading', function(e) {
        if (e.ctrlKey && e.altKey) {
            $("#localStorageModal").modal('show')
            swapData['columnName'] = e.target.dataset['department']
            swapData['departmentElem'] =  e.target.parentElement.parentElement
        }
    })



    $('#localStorageModal').on('click', '.btn', function(e) {
        if ($(e.target).hasClass('restore')) {
            var localStorageData = JSON.parse(localStorage.getItem('drawLot'))
            $('.table',swapData['departmentElem']).html(localStorageData[swapData['columnName']])
            $('.btn',swapData['departmentElem']).html('重新排序')
            console.log(typeof $('.applicant',swapData['department']).html());
            var tdContent = $('.applicant',swapData['departmentElem']).html()
            if(tdContent ==='' ){
                $('.btn',swapData['departmentElem']).html('开始排序')
            }
            $('#localStorageModal').modal('hide')
        }
        if ($(e.target).hasClass('reset')) {
            var len = applicants[swapData['columnName']].length,
                index = 0,
                str = ''
            while (index++ < len) {
                str += '<tr><td>' + index + '</td><td class="applicant"></td></tr>';
            }
            $('.table',swapData['departmentElem']).html(str)
            $('.btn',swapData['departmentElem']).html('开始排序')
            $('#localStorageModal').modal('hide')

        }
    })


})
