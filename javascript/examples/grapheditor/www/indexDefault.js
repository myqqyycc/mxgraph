//临时变量，不能与其他变量冲突，以防出问题
var myEditorUi=null;

//临时缓存，可以删除
var cacheObjId={};
function getObjIdById(id) {
    if(!cacheObjId.hasOwnProperty(id)){
        return cacheObjId[id]="ssss:"+Math.random()
    }
    return cacheObjId[id]
}

function saveForm(obj) {
    var formData={};
    var form=$(obj).closest("form");

    formData["id"]=form.attr("cell_id");

    form.find(".diyDataClass").each(function () {
        formData[$(this).attr("aim_key")]=$(this).val();
    })

    alert(JSON.stringify(formData))
    closeForm()
}

function closeForm() {
    myEditorUi.hideDialog.apply(myEditorUi, arguments);
}