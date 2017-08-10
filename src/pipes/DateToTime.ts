import { Pipe, PipeTransform } from '@angular/core'


@Pipe({
  name: 'DateToTime',
})

export class DateToTime implements PipeTransform {
  /**
   * Transform date string to formatted time string
  */

  transform(value, args) {
    let mStrValue = "";

    if (value != null && value != "") {
      var dateObj = new Date(value.replace(/-/g, '/'));

      if (dateObj != null && isNaN(dateObj.getTime()) == false) {
        if (dateObj.getTime() != null) {
          var mHours = dateObj.getHours();
          var mMinutes = dateObj.getMinutes();
          var type = "AM";

          if (mHours >= 12) {
            type = "PM";

            if (mHours > 12) {
              mHours = mHours - 12;
            }
          }

          mStrValue = mHours + ":" + mMinutes + " " + type;
        }
      }
    }

    return mStrValue;
  }
}
