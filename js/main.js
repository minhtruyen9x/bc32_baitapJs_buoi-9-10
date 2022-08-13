// khởi tạo hàm dom domAll cho tiện việc dom
function dom(selector) {
    return document.querySelector(selector)
}

function dommAll(selector) {
    return document.querySelectorAll(selector)
}


// Khởi tạo staff constructor để tạo đối tượng STAFF
function Staff(account, name, email, pass, workDay, basicSalary, position, hoursPerMonth) {
    this.account = account;
    this.name = name;
    this.email = email;
    this.pass = pass;
    this.workDay = workDay;
    this.basicSalary = basicSalary;
    this.position = position;
    this.hoursPerMonth = hoursPerMonth;
    this.totalSalary = this.calcSalary();
    this.typeOfStaff = this.calcTypeStaff();
}

Staff.prototype.calcSalary = function () {
    switch (this.position) {
        case "Sếp": {
            return this.basicSalary * 3
        }
        case "Trưởng phòng": {
            return this.basicSalary * 2
        }
        case "Nhân viên": {
            return this.basicSalary * 1
        }
    }
}

Staff.prototype.calcTypeStaff = function () {
    if (this.hoursPerMonth < 160) return "nhân viên trung bình"
    if (this.hoursPerMonth < 176) return "nhân viên khá"
    if (this.hoursPerMonth < 192) return "nhân viên giỏi"
    if (this.hoursPerMonth >= 192) return "nhân viên xuất sắc"
}



// Khởi tạo giá trị kho lưu trữ staff ban đầu (nếu có) và render ra giao diện
const KEY_STORAGE = "staff manage"
let staffs = []
function init() {
    staffs = JSON.parse(localStorage.getItem(KEY_STORAGE)) || []
    staffs = staffs.map(staff => {
        return new Staff(staff.account, staff.name, staff.email, staff.pass, staff.workDay, staff.basicSalary, staff.position, staff.hoursPerMonth)
    })
    render(staffs)
}
init()


// Hàm render ra table gồm các staff tương ứng 
function render(staffs) {
    let htmls = staffs.reduce((result, staff, index) => {
        return result + `
            <tr>
                <td>${staff.account}</td>
                <td>${staff.name}</td>
                <td>${staff.email}</td>
                <td>${staff.workDay}</td>
                <td>${staff.position}</td>
                <td>${staff.totalSalary.toLocaleString("vn")}</td>
                <td>${staff.typeOfStaff}</td>
                <td>
                    <button 
                        class="btn btn-danger"
                        onclick="deleteStaff('${staff.account}')"
                        onclick="editStaff('${staff.account}')"
                    >delete</button>
                    <button 
                        class="btn btn-success"
                        onclick="editStaff('${staff.account}')"
                    >Edit</button>
                </td>
            </tr>
        `
    }, '')

    dom("#tableDanhSach").innerHTML = htmls
}

// Hàm addStaff thêm nhân viên mới vào mảng
function addStaff() {
    let account = dom("#tknv").value
    let name = dom("#name").value
    let email = dom("#email").value
    let pass = dom("#password").value
    let workDay = dom("#datepicker").value
    let basicSalary = +dom("#luongCB").value
    let position = dom("#chucvu").value
    let hoursPerMonth = +dom("#gioLam").value

    // validate toàn bộ form
    let isFormValid = validateForm();
    if (!isFormValid) {
        sendErrorMess()
        return
    }

    // Kiểm tra account input có bị trùng
    let errorMess = sameIDRule(account, staffs, "account", "Account value is valid in array, request fail!!!")
    if (errorMess) {
        sendErrorMess(errorMess)
        return
    }

    let newStaff = new Staff(account.trim(), name.trim(), email.trim(), pass.trim(), workDay.trim(), basicSalary, position, hoursPerMonth)
    // Thêm nhân viên mới vào mảng
    staffs.push(newStaff)
    // Lưu local storage
    localStorage.setItem(KEY_STORAGE, JSON.stringify(staffs))
    // đóng form khi click thêm nhân viên
    closeForm()
    //reset lại các input của form
    resetForm()
    // render lại mảng staffs ra giao diên 
    render(staffs)
    // gửi thông báo thêm nhân viên thành công
    sendSuccessMess("Your request for new staff has benn aplied")
}

// Hàm deleteStaff xóa nhân viên khỏi mảng
function deleteStaff(staffAccount) {
    // lọc bỏ các nhân viên có id tương ứng
    staffs = staffs.filter(staff => staff.account !== staffAccount)

    // lưu local storage
    localStorage.setItem(KEY_STORAGE, JSON.stringify(staffs))

    render(staffs);
    sendInfoMess("Your delete request has been aplied")
}

// Hàm editStaff chỉnh sửa nhân vien trong mảng
function editStaff(staffAccount) {
    // enable nút cập nhật
    dom("#btnCapNhat").disabled = false
    // Mở form edit
    dom("#btnThem").click()
    // disable nút thêm người dùng
    dom("#btnThemNV").disabled = true
    // disable input tài khoản nhân viên
    let accountInput = dom("#tknv")
    accountInput.disabled = true

    let staff = staffs.find(staff => staff.account === staffAccount)

    accountInput.value = staff.account
    dom("#name").value = staff.name
    dom("#email").value = staff.email
    dom("#password").value = staff.pass
    dom("#datepicker").value = staff.workDay
    dom("#luongCB").value = staff.basicSalary
    dom("#chucvu").value = staff.position
    dom("#gioLam").value = staff.hoursPerMonth
}

// Hàm updateStaff cập nhật các thông tin nhân viên trong mảng
function updateStaff() {
    let account = dom("#tknv").value
    let name = dom("#name").value
    let email = dom("#email").value
    let pass = dom("#password").value
    let workDay = dom("#datepicker").value
    let basicSalary = +dom("#luongCB").value
    let position = dom("#chucvu").value
    let hoursPerMonth = +dom("#gioLam").value

    // Kiểm tra form input hợp lệ
    let isFormValid = validateForm();
    if (!isFormValid) {
        sendErrorMess()
        return
    }

    // Tạo nhân viên mới
    let newStaff = new Staff(account, name, email, pass, workDay, basicSalary, position, hoursPerMonth)
    // lấy index nhân viên đang sửa
    let currentIndex = staffs.findIndex(staff => staff.account === account)
    //thay thế nhân viên mới vào mảng
    staffs[currentIndex] = newStaff

    // Lưu local storage
    localStorage.setItem(KEY_STORAGE, JSON.stringify(staffs))

    // đóng form khi click thêm nhân viên
    closeForm()
    //reset lại các input của form
    resetForm()
    // render lại mảng staffs ra giao diên 
    render(staffs)
    // gửi thông báo thêm nhân viên thành công
    sendSuccessMess("Update successfully, nothing error")

}


// Hàm searchStaff tìm kiếm nhân viên trong mảng
function searchStaff() {
    let type = dom("#searchName").value
    let newStaffs = staffs.filter(staff => staff.typeOfStaff.includes(type))
    render(newStaffs)
}

// Hàm closeForm đóng form nhập dữ liệu
function closeForm() {
    // Đóng form
    dom("#btnDong").click()
    // disable nút cập nhật nhân viên
    dom("#btnCapNhat").disabled = true
    // enable input mã nhân viên
    dom("#tknv").disabled = false
    // enable nút thêm nhân viên
    dom("#btnThemNV").disabled = false

    resetForm()
}

// Hàm resetForm reset các giá trị input trong form
function resetForm() {
    dom("#tknv").value = ''
    dom("#name").value = ''
    dom("#email").value = ''
    dom("#password").value = ''
    dom("#datepicker").value = ''
    dom("#luongCB").value = ''
    dom("#chucvu").value = ''
    dom("#gioLam").value = ''

    let spanEls = document.querySelectorAll(".sp-thongbao")
    spanEls.forEach(spanEl => {
        spanEl.style.display = 'none'
        spanEl.innerText = ""
    })
}

//**************** Validator************************* */

function validateForm() {
    let isFormValid =
        validateAccount() &
        validateName() &
        validateEmail() &
        validatePass() &
        validateDate() &
        validateSalary() &
        validateType() &
        validateHour()

    if (isFormValid) return true
    return false
}



function validateAccount() {
    let account = dom("#tknv").value.trim()
    let spanEl = dom("#tbTKNV")

    let errorMess = emptyRule(account) || numRule(account) || rangeCharactorRule(account, 4, 6, "Tài khoản tối đa 4 - 6 ký số")
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}

function validateName() {
    let name = dom("#name").value.trim()
    let spanEl = dom("#tbTen")

    let errorMess = emptyRule(name) || characterRule(name)
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}

function validateEmail() {
    let email = dom("#email").value.trim()
    let spanEl = dom("#tbEmail")

    let errorMess = emptyRule(email) || emailRule(email)
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}

function validatePass() {
    let pass = dom("#password").value.trim()
    let spanEl = dom("#tbMatKhau")

    let errorMess = emptyRule(pass) || passwordRule(pass)
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}


function validateDate() {
    let workDay = dom("#datepicker").value
    let spanEl = dom("#tbNgay")

    let errorMess = emptyRule(workDay) || dateRule(workDay)
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}


function validateSalary() {
    let basicSalary = +dom("#luongCB").value
    let spanEl = dom("#tbLuongCB")

    let errorMess = emptyRule(basicSalary) || rangeRule(basicSalary, 1000000, 20000000, "Lương cơ bản phải từ 1,000,000 đến 20,000,000")
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}

function validateType() {
    let position = dom("#chucvu").value
    let spanEl = dom("#tbChucVu")

    let errorMess = typeRule(position)
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}

function validateHour() {
    let hoursPerMonth = +dom("#gioLam").value
    let spanEl = dom("#tbGiolam")

    let errorMess = emptyRule(hoursPerMonth) || rangeRule(hoursPerMonth, 80, 200, "Số giờ làm phải từ 80 đến 200 giờ")
    if (errorMess) {
        spanEl.style.display = "block"
        spanEl.innerText = errorMess
        return false
    }
    spanEl.style.display = "none"
    spanEl.innerText = ""
    return true
}


// Các hàm kiểm tra tính hợp lệ của giá trị value
// Nếu hợp lệ trả về undefined
// Không hợp lệ trả về message lỗi tương ứng

function emptyRule(value, message) {
    if (!value) {
        return message || "Trường này chưa nhập thông tin"
    }
    return undefined
}

function sameIDRule(value, array, prop, message) {
    console.log(value)
    if (array.find(element => element[prop] === value)) return message || "ID bị trùng không thể thêm mới"
    return undefined
}

function numRule(value, message) {
    if (isNaN(value)) return message || "Giá trị phải là ký số từ 0-9"
    return undefined
}

// function minNumRule(value, min, message) {
//     if (value.length < min) return message || `Trường này phải nhập ít nhất ${min} ký số`
//     return undefined
// }

// function maxNumRule(value, max, message) {
//     if (value.length > max) return message || `Trường này chỉ được nhập nhiều nhất ${max} ký số`
//     return undefined
// }

function rangeCharactorRule(value, min, max, message) {
    if (value.length < min || value.length > max) return message || `Giá trị nhập phải nằm từ ${min} đến ${max}`
    return undefined
}

function characterRule(value, message) {
    let regex = /\b([A-ZÀ-ÿ][-,a-z. '][a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+[ ]*)+/
    if (!regex.test(value)) return message || "Nhập tên không chính xác"
    return undefined
}

function emailRule(value, message) {
    let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    if (!regex.test(value)) return message || "Email nhập không hợp lệ"
    return undefined
}

function passwordRule(value, message) {
    let regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,10}$/
    if (!regex.test(value)) return message || "Trường này phải có từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)"
    return undefined
}


function dateRule(value, message) {
    let regex = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/
    if (!regex.test(value)) return message || "Ngày tháng không chính xác MM/DD/YYYY"
    return undefined
}

function typeRule(value, message) {
    switch (value) {
        case "Sếp":
        case "Trưởng phòng":
        case "Nhân viên": {
            return undefined
        }
        default: {
            return message || `Giá trị không hợp lệ`
        }
    }
}

function rangeRule(value, min, max, message) {
    if (value < min || value > max) return message || `Giá trị nhập phải nằm từ ${min} đến ${max}`
    return undefined
}
