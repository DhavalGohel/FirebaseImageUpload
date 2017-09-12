import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, Platform, Events, AlertController, ModalController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ExpensesService } from '../../../providers/expenses-service/expenses-service';
import { InvoiceSelectModel } from '../../modals/invoice-select/invoice-select'


@Component({
  selector: 'page-expenses-add',
  templateUrl: 'expenses-add.html'
})

export class ExpensesAddPage {
  @ViewChild('navbar') navBar: Navbar;

  public apiResult: any;
  public api_token = this.appConfig.mToken;

  public selectedTab: string = 'part_1';
  public IsClientExpense: boolean = true;

  public expenseData: any = {};
  public mTodayDate: any = new Date().toISOString();
  public mPaymentDate: any = this.mTodayDate;
  public mChequeDate: any = this.mTodayDate;
  public mTransactionDate: any = this.mTodayDate;

  public mClientDD: any = [];
  public mEmployeeDD: any = [];
  public mPaymentMethodDD: any = [];
  public mExpenseTypesDD: any = [];

  public mExpenseData: any = {
    expense_id: '',
    amount: '',
    description: '',
  };

  public ExpenseSelectModel: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public expensesService: ExpensesService,
    public platform: Platform,
    public eventsCtrl: Events,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    this.platform.ready().then((readySource) => {
      this.platform.registerBackButtonAction(() => {
        this.onChangeTabFromBackButton();
      });

      this.navBar.backButtonClick = () => {
        this.onChangeTabFromBackButton();
      };
    });

    this.eventsCtrl.subscribe("search-select:refresh_value", (data) => {
      this.onSearchSelectChangeValue(data);
    });

    this.eventsCtrl.subscribe("invoice-add:refresh_data", (data) => {
      this.onSelectChangeValue(data);
    });

    this.initExpenseData();
    this.onLoadGetCreateData();
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");
    this.eventsCtrl.unsubscribe("invoice-add:refresh_data");
  }

  initExpenseData() {
    this.expenseData.expense_type = "client";
    this.expenseData.client_id = "0";
    this.expenseData.payment_date = this.appConfig.transformDate(this.mPaymentDate);
    this.expenseData.paid_by = "";
    this.expenseData.payment_via = "";
    this.expenseData.cheque_no = "";
    this.expenseData.cheque_date = this.appConfig.transformDate(this.mChequeDate);
    this.expenseData.cheque_bank_name = "";
    this.expenseData.transaction_no = "";
    this.expenseData.transaction_date = this.appConfig.transformDate(this.mTransactionDate);
    this.expenseData.remark = "";
    this.expenseData.internalremark = "";

    this.expenseData.mExpenseDataList = [];
  }

  onChangeTabFromBackButton() {
    // console.log(this.selectedTab);

    if (this.selectedTab == "part_2") {
      this.onClickSetTab("part_1");
    } else if (this.selectedTab == "part_1") {
      this.navCtrl.pop();
    }
  }

  onClickSetTab(tabName) {
    setTimeout(() => {
      this.selectedTab = tabName;
    }, 500);
  }

  changeToggleClientExpense() {
    if (this.IsClientExpense) {
      this.expenseData.expense_type = "client";
    } else {
      this.expenseData.expense_type = "no";
      this.expenseData.client_id = "0";
    }
  }

  onLoadGetCreateData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.expensesService.getCreateData(this.api_token).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.setExpenseData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setExpenseData(data) {
    // console.log(data);

    if (data != null) {
      if (data.clients != null && Object.keys(data.clients).length > 0) {
        this.mClientDD = this.appConfig.getFormattedArray(data.clients);
      }

      if (data.employees != null && Object.keys(data.employees).length > 0) {
        this.mEmployeeDD = this.appConfig.getFormattedArray(data.employees);
      }

      if (data.payment_via != null && Object.keys(data.payment_via).length > 0) {
        this.mPaymentMethodDD = this.appConfig.getFormattedArray(data.payment_via);
      }

      if (data.expense_types != null && Object.keys(data.expense_types).length > 0) {
        this.mExpenseTypesDD = this.appConfig.getFormattedArray(data.expense_types);
      }
    }
  }

  onSearchSelectChangeValue(data) {
    // console.log(data);

    if (data.element.id == "txtClient") {
      this.expenseData.client_id = data.data.key;

      if (this.expenseData.client_id == "") {
        this.expenseData.client_id = "0";
      }
    } else if (data.element.id == "txtEmployee") {
      this.expenseData.paid_by = data.data.key;
    } else if (data.element.id == "txtPaymentMethod") {
      this.expenseData.payment_via = data.data.key;

      this.resetPaymentData();
    } else if (data.element.id == 'txtExpense') {
      this.mExpenseData.expense_id = data.data.key;
    }
  }

  resetPaymentData() {
    this.expenseData.cheque_no = "";
    this.expenseData.cheque_bank_name = "";

    this.mChequeDate = this.mTodayDate;
    this.expenseData.cheque_date = this.appConfig.transformDate(this.mChequeDate);

    this.expenseData.transaction_no = "";
    this.mTransactionDate = this.mTodayDate;
    this.expenseData.transaction_date = this.appConfig.transformDate(this.mTransactionDate);
  }

  multipleError(error) {
    let msg: any = [];

    Object.keys(error).forEach((item) => {
      msg += error[item] + "<br />";
    });

    this.appConfig.showAlertMsg(this.appMsgConfig.Error, msg);
  }

  getValueNameById(dataDDList, valueId) {
    let value = "";

    if (dataDDList.length != null && dataDDList.length > 0) {
      for (let i = 0; i < dataDDList.length; i++) {
        if (dataDDList[i].key == valueId) {
          value = dataDDList[i].value;
          break;
        }
      }
    }

    return value;
  }

  onSelectChangeValue(data) {
    this.expenseData.mExpenseDataList[data.itemIndex].expense_id = data.itemData.expense_id;
    this.expenseData.mExpenseDataList[data.itemIndex].expense_name = this.getValueNameById(this.mExpenseTypesDD, data.itemData.expense_id);
    this.expenseData.mExpenseDataList[data.itemIndex].amount = data.itemData.amount;
    this.expenseData.mExpenseDataList[data.itemIndex].description = data.itemData.description;
  }

  openItemEditModal(index, item, valuedd, title) {
    this.ExpenseSelectModel = this.modalCtrl.create(InvoiceSelectModel, { index: index, item: item, valuedd: valuedd, title: title }, { enableBackdropDismiss: false });
    this.ExpenseSelectModel.present();
  }

  onClickExpanceRemove(expenseIndex) {
    this.expenseData.mExpenseDataList.splice(expenseIndex, 1);
  }

  clearExpenseData() {
    this.mExpenseData = {
      expense_id: '',
      expense_name: '',
      amount: '',
      description: '',
    }
  }

  onClickExpenseSubmit() {
    if (this.mExpenseData.expense_id == null || (this.mExpenseData.expense_id != null && (this.mExpenseData.expense_id == 0 || this.mExpenseData.expense_id.trim() == ''))) {
      this.appConfig.showAlertMsg("", "Please select expense type.");
    } else if (this.mExpenseData.amount == null || (this.mExpenseData.amount != null && this.mExpenseData.amount.trim() == "")) {
      this.appConfig.showAlertMsg("", "Please enter amount.");
    } else if (isNaN(+this.mExpenseData.amount) || parseInt(this.mExpenseData.amount) < 0) {
      this.appConfig.showAlertMsg("", "Amount must be numeric.");
    } else {
      this.expenseData.mExpenseDataList.push({
        'expense_id': this.mExpenseData.expense_id,
        'expense_name': this.getValueNameById(this.mExpenseTypesDD, this.mExpenseData.expense_id),
        'amount': this.mExpenseData.amount,
        'description': this.mExpenseData.description
      });

      this.clearExpenseData();
    }
  }

  checkClientId() {
    let isValid = true;

    if (this.expenseData.expense_type == 'client') {
      if (this.expenseData.client_id != null && this.expenseData.client_id != "" && this.expenseData.client_id != "0") {
        isValid = true;
      } else {
        this.appConfig.showAlertMsg("", "Please select client");
        isValid = false;
      }
    }

    return isValid;
  }

  checkPaidBy() {
    let isValid = true;

    if (this.expenseData.paid_by != null && this.expenseData.paid_by != "" && this.expenseData.paid_by != "0") {
      isValid = true;
    } else {
      this.appConfig.showAlertMsg("", "Please select paid by");
      isValid = false;
    }

    return isValid;
  }

  checkPaymentMethod() {
    let isValid = true;

    if (this.expenseData.payment_via != null && this.expenseData.payment_via != "") {
      if (this.expenseData.payment_via.toLowerCase() == "cheque") {
        if (this.expenseData.cheque_no == null || (this.expenseData.cheque_no != null && this.expenseData.cheque_no == "")) {
          isValid = false;
          this.appConfig.showAlertMsg("", "The cheque no is required when payment through cheque");
        } else if (this.expenseData.cheque_bank_name == null || (this.expenseData.cheque_bank_name != null && this.expenseData.cheque_bank_name == "")) {
          isValid = false;
          this.appConfig.showAlertMsg("", "The cheque bank name is required when payment through cheque");
        }
      } else if (this.expenseData.payment_via.toLowerCase() == "debit"
        || this.expenseData.payment_via.toLowerCase() == "credit"
        || this.expenseData.payment_via.toLowerCase() == "rtgs"
        || this.expenseData.payment_via.toLowerCase() == "neft") {
        if (this.expenseData.transaction_no == null || (this.expenseData.transaction_no != null && this.expenseData.transaction_no == "")) {
          isValid = false;
          this.appConfig.showAlertMsg("", "The transaction no is required");
        }
      }

    } else {
      this.appConfig.showAlertMsg("", "Please select payment via");
      isValid = false;
    }

    return isValid;
  }

  checkExpenseListData() {
    let isValid = true;

    if (this.expenseData.mExpenseDataList == null || (this.expenseData.mExpenseDataList != null && this.expenseData.mExpenseDataList.length <= 0)) {
      if (this.mExpenseData.expense_id == null || (this.mExpenseData.expense_id != null && (this.mExpenseData.expense_id == 0 || this.mExpenseData.expense_id.trim() == ''))) {
        isValid = false;
        this.appConfig.showAlertMsg("", "Please select expense type.");
      } else if (this.mExpenseData.amount == null || (this.mExpenseData.amount != null && this.mExpenseData.amount.trim() == "")) {
        isValid = false;
        this.appConfig.showAlertMsg("", "Please enter amount.");
      } else if (isNaN(+this.mExpenseData.amount) || parseInt(this.mExpenseData.amount) < 0) {
        isValid = false;
        this.appConfig.showAlertMsg("", "Amount must be numeric.");
      } else {
        this.onClickExpenseSubmit();
      }
    }

    return isValid;
  }

  hasValidateData() {
    let isValidate = true;

    if (!this.checkClientId()) {
      isValidate = false;
    } else if (!this.checkPaidBy()) {
      isValidate = false;
    } else if (!this.checkPaymentMethod()) {
      isValidate = false;
    } else if (!this.checkExpenseListData()) {
      isValidate = false;
    }

    return isValidate;
  }

  onClickCreateButton() {
    if (this.hasValidateData()) {
      let mAlertSubmit = this.alertCtrl.create({
        title: this.appMsgConfig.Expenses,
        subTitle: this.appMsgConfig.ExpenseSubmitConfirm,
        buttons: [{
          text: this.appMsgConfig.No
        }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.onSubmitData();
          }
        }]
      });

      mAlertSubmit.present();
    }
  }

  onSubmitData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.expenseData.api_token = this.api_token;
      this.expenseData.payment_date = this.appConfig.transformDate(this.mPaymentDate);

      if (this.expenseData.payment_via.toLowerCase() == "cash") {
        this.expenseData.cheque_no = "";
        this.expenseData.cheque_date = "";
        this.expenseData.cheque_bank_name = "";

        this.expenseData.transaction_no = "";
        this.expenseData.transaction_date = "";
      } else if (this.expenseData.payment_via.toLowerCase() == "cheque") {
        this.expenseData.cheque_date = this.appConfig.transformDate(this.mChequeDate);

        this.expenseData.transaction_no = "";
        this.expenseData.transaction_date = "";
      } else {
        this.expenseData.transaction_date = this.appConfig.transformDate(this.mTransactionDate);

        this.expenseData.cheque_no = "";
        this.expenseData.cheque_date = "";
        this.expenseData.cheque_bank_name = "";
      }

      let items = [];

      if (this.expenseData.mExpenseDataList != null && this.expenseData.mExpenseDataList.length > 0) {
        for (let i = 0; i < this.expenseData.mExpenseDataList.length; i++) {
          items.push({
            account_expenses_type_master_id: this.expenseData.mExpenseDataList[i].expense_id,
            amount: this.expenseData.mExpenseDataList[i].amount,
            description: this.expenseData.mExpenseDataList[i].description
          });
        }
      }

      this.expenseData.items = items;

      this.expensesService.addExpense(this.expenseData).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.appConfig.showNativeToast(this.appMsgConfig.ExpenseAddSuccess, "bottom", 3000);

            setTimeout(() => {
              this.navCtrl.pop();
            }, 500);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.multipleError(this.apiResult);
            }
          }
        } else {
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

}
