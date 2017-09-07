import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, Platform, Events } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';
import { ReceiptService } from '../../../providers/receipt-service/receipt-service';


@Component({
  selector: 'page-receipt-add',
  templateUrl: 'receipt-add.html'
})

export class ReceiptAddPage {
  @ViewChild('navbar') navBar: Navbar;

  public apiResult: any;
  public api_token = this.appConfig.mToken;

  public selectedTab: string = 'part_1';

  public receiptData: any = {};
  public mTotalRemainingAmount = 0;

  public mTodayDate: any = new Date().toISOString();
  public mPaymentDate: any = this.mTodayDate;
  public mChequeDate: any = this.mTodayDate;
  public mTransactionDate: any = this.mTodayDate;

  public mClientDD: any = [];
  public mPaymentMethodDD: any = [];
  public mInvoiceData: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public receiptService: ReceiptService,
    public platform: Platform,
    public eventsCtrl: Events) {
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

    this.initReceiptData();
    this.onLoadGetCreateData();
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");
  }

  initReceiptData() {
    this.receiptData.receipt_prefix = "";
    this.receiptData.receipt_number = "";
    this.receiptData.reference_number = "";
    this.receiptData.client_id = "";
    this.receiptData.payment_method = "";
    this.receiptData.payment_date = this.appConfig.transformDate(this.mPaymentDate);
    this.receiptData.cheque_no = "";
    this.receiptData.cheque_date = this.appConfig.transformDate(this.mChequeDate);
    this.receiptData.cheque_bank_name = "";
    this.receiptData.transaction_no = "";
    this.receiptData.transaction_date = this.appConfig.transformDate(this.mTransactionDate);
    this.receiptData.amount = "";
    this.receiptData.advance_amount = 0;
    this.receiptData.previous_outstanding_amount = "";
    this.receiptData.remark = "";

    this.receiptData.mInvoiceList = [];
    this.receiptData.mExpenseList = [];
  }

  onChangeTabFromBackButton() {
    // console.log(this.selectedTab);

    if (this.selectedTab == "part_3") {
      this.onClickSetTab("part_2");
    } else if (this.selectedTab == "part_2") {
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

  onLoadGetCreateData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.receiptService.getCreateData(this.api_token).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.setReceiptData(this.apiResult);
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

  setReceiptData(data) {
    // console.log(data);

    if (data != null) {
      if (data.receipt_prefix != null && data.receipt_prefix != "") {
        this.receiptData.receipt_prefix = data.receipt_prefix;
      }

      if (data.receipt_number != null && data.receipt_number != "") {
        this.receiptData.receipt_number = data.receipt_number;
      }

      if (data.clients != null && Object.keys(data.clients).length > 0) {
        this.mClientDD = this.appConfig.getFormattedArray(data.clients);
      }

      if (data.payment_methods != null && Object.keys(data.payment_methods).length > 0) {
        this.mPaymentMethodDD = this.appConfig.getFormattedArray(data.payment_methods);
      }
    }
  }

  checkReceiptPrefix() {
    if (this.receiptData.receipt_prefix != null && this.receiptData.receipt_prefix != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter receipt prefix");
      return false;
    }
  }

  checkReceiptNumber() {
    if (this.receiptData.receipt_number != null && this.receiptData.receipt_number != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter receipt number");
      return false;
    }
  }

  checkReferenceNumber() {
    if (this.receiptData.reference_number != null && this.receiptData.reference_number != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Enter reference number");
      return false;
    }
  }

  checkClientId() {
    if (this.receiptData.client_id != null && this.receiptData.client_id != "") {
      return true;
    } else {
      this.appConfig.showAlertMsg("", "Please select client");
      return false;
    }
  }

  checkPaymentMethod() {
    let isValid = true;

    if (this.receiptData.payment_method != null && this.receiptData.payment_method != "") {

      if (this.receiptData.payment_method.toLowerCase() == "cheque") {
        if (this.receiptData.cheque_no == null || (this.receiptData.cheque_no != null && this.receiptData.cheque_no == "")) {
          isValid = false;
          this.appConfig.showAlertMsg("", "The cheque no is required when payment through cheque");
        } else if (this.receiptData.cheque_bank_name == null || (this.receiptData.cheque_bank_name != null && this.receiptData.cheque_bank_name == "")) {
          isValid = false;
          this.appConfig.showAlertMsg("", "The cheque bank name is required when payment through cheque");
        }
      } else if (this.receiptData.payment_method.toLowerCase() == "debit"
        || this.receiptData.payment_method.toLowerCase() == "credit"
        || this.receiptData.payment_method.toLowerCase() == "rtgs"
        || this.receiptData.payment_method.toLowerCase() == "neft") {
        if (this.receiptData.transaction_no == null || (this.receiptData.transaction_no != null && this.receiptData.transaction_no == "")) {
          isValid = false;
          this.appConfig.showAlertMsg("", "The transaction no is required");
        }
      }

    } else {
      this.appConfig.showAlertMsg("", "Please select payment method");
      isValid = false;
    }

    return isValid;
  }

  checkAmount() {
    if (this.receiptData.amount != null && this.receiptData.amount.toString().trim() != "") {
      if (isNaN(this.receiptData.amount)) {
        this.appConfig.showAlertMsg("", "Amount must be numeric");
        return false;
      } else {
        return true;
      }
    } else {
      this.appConfig.showAlertMsg("", "Please enter amount");
      return false;
    }
  }

  hasValidateData() {
    let isValidate = true;

    if (!this.checkReceiptPrefix()) {
      isValidate = false;
    } else if (!this.checkReceiptNumber()) {
      isValidate = false;
    } else if (!this.checkReferenceNumber()) {
      isValidate = false;
    } else if (!this.checkClientId()) {
      isValidate = false;
    } else if (!this.checkPaymentMethod()) {
      isValidate = false;
    } else if (!this.checkAmount()) {
      isValidate = false;
    }

    return isValidate;
  }

  multipleError(error) {
    let msg: any = [];

    Object.keys(error).forEach((item) => {
      msg += error[item] + "<br />";
    });

    this.appConfig.showAlertMsg(this.appMsgConfig.Error, msg);
  }

  onClickCreateButton() {
    if (this.hasValidateData()) {
      this.receiptData.api_token = this.api_token;
      this.receiptData.payment_date = this.appConfig.transformDate(this.mPaymentDate);

      if (this.receiptData.payment_method.toLowerCase() == "cash") {
        this.receiptData.cheque_no = "";
        this.receiptData.cheque_date = "";
        this.receiptData.cheque_bank_name = "";

        this.receiptData.transaction_no = "";
        this.receiptData.transaction_date = "";
      } else if (this.receiptData.payment_method.toLowerCase() == "cheque") {
        this.receiptData.cheque_date = this.appConfig.transformDate(this.mChequeDate);

        this.receiptData.transaction_no = "";
        this.receiptData.transaction_date = "";
      } else {
        this.receiptData.transaction_date = this.appConfig.transformDate(this.mTransactionDate);

        this.receiptData.cheque_no = "";
        this.receiptData.cheque_date = "";
        this.receiptData.cheque_bank_name = "";
      }

      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);

        this.receiptService.addReceipt(this.receiptData).then(result => {
          if (result != null) {
            this.appConfig.hideLoading();

            this.apiResult = result;

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.ReceiptAddSuccess, "bottom", 3000);

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

  onClientChange() {
    if (this.receiptData.client_id != null && this.receiptData.client_id != "") {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);

        this.receiptService.getClientInvoiceList(this.receiptData.client_id, this.api_token).then(result => {
          if (result != null) {
            this.appConfig.hideLoading();

            this.apiResult = result;

            if (this.apiResult.success) {
              this.setInvoiceExpenseData(this.apiResult);
            } else {
              this.setInvoiceExpenseData(null);

              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
              }
            }
          } else {
            this.setInvoiceExpenseData(null);
            this.appConfig.hideLoading();
            this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
          }
        }, error => {
          this.setInvoiceExpenseData(null);
          this.appConfig.hideLoading();
          this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
        });
      } else {
        this.setInvoiceExpenseData(null);
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    } else {
      this.receiptData.mInvoiceList = [];
      this.receiptData.mExpenseList = [];
      this.mInvoiceData = {};

      this.mTotalRemainingAmount = 0;
      this.receiptData.advance_amount = 0;
      this.receiptData.previous_outstanding_amount = "";
    }
  }

  setInvoiceExpenseData(data) {
    // console.log(data);

    this.receiptData.mInvoiceList = [];
    this.receiptData.mExpenseList = [];

    if (data != null) {
      if (data.invoice != null && data.invoice.length > 0) {
        for (let i = 0; i < data.invoice.length; i++) {
          data.invoice[i].pending_amount = parseFloat(data.invoice[i].pending_amount).toFixed(2);
          data.invoice[i].invoice_amount = data.invoice[i].total;
          data.invoice[i].amount = "";

          this.receiptData.mInvoiceList.push(data.invoice[i]);
        }

        this.calculateInvoiceListAmount();
      }

      if (data.expense != null && data.expense.length > 0) {
        for (let i = 0; i < data.expense.length; i++) {
          this.receiptData.mExpenseList.push(data.expense[i]);
        }
      }

      if (data.invoice_data != null && Object.keys(data.invoice_data).length > 0) {
        this.mInvoiceData = data.invoice_data;

        if (this.mInvoiceData.current_balance != null && this.mInvoiceData.current_balance != "") {
          this.mInvoiceData.balance_type = "CR.";
          this.receiptData.previous_outstanding_amount = this.mInvoiceData.current_balance;

          if (parseFloat(this.mInvoiceData.current_balance) < 0) {
            this.mInvoiceData.balance_type = "DR.";
            this.mInvoiceData.current_balance = Math.abs(this.mInvoiceData.current_balance);
          }
        } else {
          this.mInvoiceData.balance_type = "";
          this.receiptData.previous_outstanding_amount = "";
        }
      } else {
        this.mInvoiceData.balance_type = "";
        this.receiptData.previous_outstanding_amount = "";
      }
    }
  }

  onSearchSelectChangeValue(data) {
    // console.log(data);

    if (data.element.id == "txtClient") {
      this.receiptData.client_id = data.data.key;

      this.onClientChange();
    } else if (data.element.id == "txtPaymentMethod") {
      this.receiptData.payment_method = data.data.key;

      this.resetPaymentData();
    }
  }

  resetPaymentData() {
    this.receiptData.cheque_no = "";
    this.receiptData.cheque_bank_name = "";

    this.mChequeDate = this.mTodayDate;
    this.receiptData.cheque_date = this.appConfig.transformDate(this.mChequeDate);

    this.receiptData.transaction_no = "";
    this.mTransactionDate = this.mTodayDate;
    this.receiptData.transaction_date = this.appConfig.transformDate(this.mTransactionDate);
  }

  onChangeAmount() {
    if (this.receiptData.amount != null && this.receiptData.amount != "") {
      this.mTotalRemainingAmount = parseFloat(this.receiptData.amount);
    } else {
      this.mTotalRemainingAmount = 0;
    }

    this.calculateInvoiceListAmount();
  }

  calculateInvoiceListAmount() {
    if (this.receiptData.amount != null && this.receiptData.amount != "") {
      this.mTotalRemainingAmount = parseFloat(this.receiptData.amount);
    } else {
      this.mTotalRemainingAmount = 0;
    }

    if (this.receiptData.mInvoiceList != null && this.receiptData.mInvoiceList.length > 0) {
      for (let i = 0; i < this.receiptData.mInvoiceList.length; i++) {
        if (this.mTotalRemainingAmount > 0) {
          if (this.mTotalRemainingAmount >= this.receiptData.mInvoiceList[i].pending_amount) {
            this.receiptData.mInvoiceList[i].amount = parseFloat(this.receiptData.mInvoiceList[i].pending_amount).toFixed(2);
          } else {
            this.receiptData.mInvoiceList[i].amount = this.mTotalRemainingAmount.toFixed(2);
          }

          this.mTotalRemainingAmount = parseFloat(this.mTotalRemainingAmount.toFixed(2)) - parseFloat(this.receiptData.mInvoiceList[i].amount);
          this.mTotalRemainingAmount = parseFloat(this.mTotalRemainingAmount.toFixed(2));
        } else {
          this.receiptData.mInvoiceList[i].amount = "";
        }
      }

      this.receiptData.advance_amount = this.mTotalRemainingAmount.toFixed(2);
    }
  }

}
