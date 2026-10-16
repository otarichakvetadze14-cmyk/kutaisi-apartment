import { Wifi, Coffee, Shield } from 'lucide-react'

export function ApartmentInfo() {
  return (
    <div className="space-y-10">
      <div className="border-b border-neutral-200/80 pb-8">
        <h3 className="text-xl font-serif mb-6 text-neutral-900">აპარტამენტის შესახებ</h3>
        <p className="text-neutral-600 font-light leading-relaxed mb-6">
          ეს არის დახვეწილი დიზაინის მქონე სივრცე, სადაც ისტორიული გარემო ერწყმის თანამედროვე მინიმალისტურ კომფორტს. იდეალურია წყვილებისთვის, ოჯახებისთვის ან ინდივიდუალური მოგზაურებისთვის.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
          <div className="flex items-center gap-3 text-neutral-700">
            <Wifi className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-light">სწრაფი Wi-Fi</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-700">
            <Coffee className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-light">სრული სამზარეულო</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-700">
            <Shield className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-light">უსაფრთხო გარემო</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-serif mb-4 text-neutral-900">მდებარეობა</h3>
        <p className="text-neutral-600 font-light leading-relaxed">
          მდებარეობს ზუსტად ქუთაისის გულში, ცენტრალურ მოედანზე. ფეხით მისადგომ მანძილზეა ყველა მთავარი კულტურული ძეგლი, საუკეთესო კაფეები და რესტორნები.
        </p>
      </div>
    </div>
  )
}