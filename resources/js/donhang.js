(function ($) {
    let DonHang = function () {
        this.baseUrl = "don-hang";
    };
    jQuery.DonHang = new DonHang();
    jQuery.extend(DonHang.prototype, {
        func_init: function () {
            $(".select2").select2();
            tinyMCE.remove();
            tinymce.baseURL = "tinymce";
            tinymce.init({
                selector: "textarea#gioi_thieu",
                toolbar:
                    "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
            });
        },
        func_callback_error: function (err, data) {
            func_hide_error_validation("#form-modal");
            if (err.data.messages) {
                jQuery.DonHang.func_show_error_validation(
                    err.data.messages,
                    "#form-modal"
                );
            }
            if (err.data.message) {
                swalAlert("error", "Lỗi", err.data.message);
            }
        },

        func_search: function (data = {}, page = 1) {
            data.page = page;
            izanagi(
                jQuery.DonHang.baseUrl,
                "post",
                data,
                null,
                jQuery.DonHang.func_search_callback,
                jQuery.DonHang.func_callback_error
            );
        },
        func_search_callback: function (res) {
            $("#list-area").html(res.data.view);
        },

        func_view_modal: function (data = {}) {
            let url = "/edit" + "/" + data.id;
            izanagi(
                jQuery.DonHang.baseUrl + url,
                "get",
                data,
                null,
                jQuery.DonHang.func_view_modal_callback,
                jQuery.DonHang.func_callback_error
            );
        },

        func_view_modal_callback: function (res) {
            $("#modal-box").html(res.data.view);

            $("#my-modal").modal({
                backdrop: "static",
                keyboard: false,
            });
            $("#my-modal").modal("show");
            jQuery.DonHang.func_init();
        },

        func_submit_form: function (data) {
            let url = "";
            let method = "post";
            console.log(data);
            if (data.get("type_modal") == modal_create) {
                url = "/store";
            }
            if (data.get("type_modal") == modal_edit) {
                url = "/update/" + data.get("id");
                // method = "put";
            }

            if (url.length == 0) return;
            izanagi(
                jQuery.DonHang.baseUrl + url,
                method,
                data,
                null,
                jQuery.DonHang.func_submit_form_callback,
                jQuery.DonHang.func_callback_error
            );
        },

        func_submit_form_callback: function (res, _data) {
            $("#my-modal").modal("hide");
            swalAlert("success", "Thành công", res.data.message);
            if (res.data.typeModal == modal_create) {
                func_clear_form($("#form-search"));
                jQuery.DonHang.page = 1;
            }
            let data = func_get_value_form("#form-search");
            jQuery.DonHang.func_search(data, jQuery.DonHang.page);
        },

        func_delete_data: function (id) {
            izanagi(
                jQuery.DonHang.baseUrl + "/delete/" + id,
                "delete",
                null,
                null,
                jQuery.DonHang.func_delete_data_callback,
                jQuery.DonHang.func_callback_error
            );
        },
        func_delete_data_callback: function (res) {
            swalAlert("success", "Thành công", res.data.message);
            let data = func_get_value_form("#form-search");
            jQuery.DonHang.func_search(data, jQuery.DonHang.page);
        },

        func_reload_num_id: function (el, isAddRow = true) {
            $(el).each(function (i, subEle) {
                $(subEle).find("select[name='mau_sac[]']")[0].id =
                    "mau_sac_" + i;

                $(subEle).find("select[name='trang_thai[]']")[0].id =
                    "trang_thai_" + i;
                $(subEle).find("input[name='size[]']")[0].id = "size_" + i;
                $(subEle).find("input[name='gia[]']")[0].id = "gia_" + i;
            });

            if (isAddRow) {
                $(el).last().find(".is-invalid").removeClass("is-invalid");
                $(el)
                    .last()
                    .find("span[class='error invalid-feedback']")
                    .remove();
                $(el).last().find("input").val("");
            }
        },

        func_show_error_validation: function (errs, idForm) {
            $(idForm).find(".is-invalid").removeClass("is-invalid");
            $(idForm).find("span[class='error invalid-feedback']").remove();
            let keys = [];
            $.each(errs, function (key, value) {
                if (key.indexOf("anh.") != -1) {
                    key = "anh";
                } else key = key.replace(".", "_");
                if (jQuery.inArray(key, keys) == -1) {
                    $(idForm + " #" + key).addClass("is-invalid");
                    let html =
                        '<span class="error invalid-feedback">' +
                        value +
                        "</span>";
                    $(idForm + " #" + key)
                        .parent()
                        .append(html);
                }
                keys.push(key);
            });
            let listSelect = $(idForm).find("select");
            $(listSelect).each(function () {
                let el = $(this);
                if (el.hasClass("is-invalid")) {
                    el.siblings("span:first")
                        .children("span:first")
                        .children("span:first")
                        .addClass("is-invalid");
                }
            });
        },
    });
})(jQuery);

jQuery(document).ready(function () {
    try {
        let $layoutSearch = $("#don-hang-page #search-area");
        let $layoutList = $("#don-hang-page #list-area");
        let $modalBox = $("#don-hang-page #modal-box");
        let $pagination = $("#don-hang-page .pagination-custom");

        let idFormSearch = "#form-search";
        let idFormModal = "#form-modal";

        jQuery.DonHang.func_init();

        //clear search form
        $layoutSearch.on("click", ".button-clear", function () {
            func_clear_form(idFormSearch);
            let data = func_get_value_form(idFormSearch);
            jQuery.DonHang.func_search(data, 1);
        });

        //button search form
        $layoutSearch.on("click", ".button-search", function () {
            let data = func_get_value_form(idFormSearch);
            jQuery.DonHang.func_search(data, 1);
        });

        $layoutList.on("click", "#btn-add", function () {
            func_clear_form(idFormModal);
            let data = {
                type_modal: modal_create,
            };
            jQuery.DonHang.func_view_modal(data);
        });

        $layoutList.on("click", ".btn-edit", function () {
            func_clear_form(idFormModal);
            let data = {
                type_modal: modal_edit,
            };
            data.id = $(this).parent().parent("tr").attr("data-id");
            if (typeof data.id === "undefined" || $.trim(data.id).length == 0) {
                swalAlert("error", "Lỗi", "Không tìm thấy dữ liệu.");
                return;
            }
            jQuery.DonHang.func_view_modal(data);
        });

        $modalBox.on("click", "#btn-save", function (e) {
            let data = func_get_value_form(idFormModal);
            if (
                typeof data.type_modal === "undefined" ||
                $.trim(data.type_modal).length == 0
            ) {
                swalAlert("error", "Lỗi", "Không tìm thấy dữ liệu.");
                return;
            }

            let formData = new FormData();
            if (data.type_modal == modal_edit) {
                if (
                    typeof data.id === "undefined" ||
                    $.trim(data.id).length == 0
                ) {
                    swalAlert("error", "Lỗi", "Không tìm thấy dữ liệu.");
                    return;
                }
                // formData.append("_method", "PUT");
            }
            let dsHinhAnh = $(idFormModal + " input[name='anh'")[0].files;

            $.each(data, function (index, value) {
                formData.append(index, value);
            });
            $.each(dsHinhAnh, function (index, value) {
                formData.append("anh[]", value);
            });

            // console.log();
            formData.append("gioi_thieu", tinyMCE.activeEditor.getContent());

            console.log(formData);

            jQuery.DonHang.func_submit_form(formData);
        });

        $layoutList.on("click", ".btn-delete", function (e) {
            e.preventDefault();
            const $mess =
                "Hành động xóa sẽ không thể khôi phục.</br>Bạn có chắc chắn muốn xóa?";
            const sw_confirm = swalConfirm($mess, "Thông báo");
            sw_confirm.fire({}).then((result) => {
                if (result.value) {
                    let id = $(this).parent().parent("tr").attr("data-id");
                    if (typeof id === "undefined" || $.trim(id).length == 0) {
                        swalAlert("error", "Lỗi", "Không tìm thấy dữ liệu.");
                        return;
                    }
                    jQuery.DonHang.func_delete_data(id);
                }
            });
        });

        $layoutList.on("click", ".page-link", function (e) {
            e.preventDefault();
            let liActive = $(this).parent().hasClass("active");
            let page = Number($(this).attr("data-page")) || false;
            if (page == false || liActive == true) {
                return;
            }
            jQuery.DonHang.page = page;
            let data = func_get_value_form(idFormSearch);
            jQuery.DonHang.func_search(data, jQuery.DonHang.page);
        });

        $modalBox.on("click", ".btn-add-row", function (e) {
            e.preventDefault();
            let el = $(this).parent().parent();
            let spItem = $("#modal-box .sanpham-item");

            spItem.find("select[name='mau_sac[]']").select2("destroy"); //Destroy select2
            spItem.find("select[name='trang_thai[]']").select2("destroy");

            let clone = $(spItem.last()).clone();

            clone.insertAfter($(spItem.last()));
            jQuery.DonHang.func_reload_num_id("#modal-box .sanpham-item");
            jQuery.DonHang.func_init();
        });
        $modalBox.on("click", ".btn-remove-row", function (e) {
            e.preventDefault();
            let spItem = $("#modal-box .sanpham-item");
            if (spItem.length == 1) {
                swalAlert("error", "Lỗi", "Không thể xóa dòng duy nhất.");
                return;
            }
            $(this).parent().parent().remove();
            jQuery.DonHang.func_reload_num_id(
                "#modal-box .sanpham-item",
                false
            );
        });
    } catch (e) {
        console.log(e);
        alert("The engine can't understand this code, it's invalid");
    }
});
