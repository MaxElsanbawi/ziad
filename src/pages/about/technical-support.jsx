// pages/legal.js

import { fa1, fa2, fa3, fa4, fa5, fa6 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppButton from "../../components/WhatsApp";


const Technical = () => {
    useEffect(() => {
      i18n.changeLanguage("ar"); // Set the language to Arabic
    }, [i18n]);
    return (<>

      <div dir={i18n.dir()} className='py-32 px-3  flex flex-col about container-about' >
          <div  className='font-extrabold text-2xl '> الدعم الفني</div>
          <br />
          <p>
        يعمل فريق الدعم الفني لتوفير خدماته لكافة مستخدمي المنصة الإلكترونية بعدة طرق حتى تتناسب مع كافة الرغبات الأسهل للمستخدمين ومنها:
      </p>
      <ul>
        <p className="pb-2"><FontAwesomeIcon  icon={fa1} size="xs" />-      دعم عبر برامج وتطبيقات الوصول لأجهزة المستخدمين مثل "TeamViewer".</p>
        <p className="pb-2"><FontAwesomeIcon  icon={fa2} size="xs" />-      دعم عبر برامج محادثات التواصل الاجتماعي (واتساب - تويتر).</p>
        <p className="pb-2"><FontAwesomeIcon  icon={fa3} size="xs" />-      دعم مباشر عبر الهاتف.</p>
        <p className="pb-2"> <FontAwesomeIcon  icon={fa4} size="xs" />-     دعم داخل قاعة التدريب.</p>
        <p className="pb-2"><FontAwesomeIcon  icon={fa5} size="xs" />-      دعم عبر الايميل.</p>
        <p className="pb-2"> <FontAwesomeIcon  icon={fa6} size="xs" />-     دعم عبر نموذج الدعم الفني بالموقع الإلكتروني.</p>
      </ul>

      <h2 className="pb-2">قنوات تقديم الدعم الفني</h2>
      <h3 className="pb-2">مركز الاتصال المباشر</h3>
      <p className="pb-2">
        <strong>00966553105660 - 920009129</strong> خلال أوقات العمل الرسمي طول أيام الأسبوع من 10 صباحاً إلى 10 مساءً، وأثناء أوقات إقامة الدورات التدريبية.
      </p>

      <h3 className="pb-2">البريد الإلكتروني للخدمات والدعم الفني</h3>
      <p className="pb-2">
        <strong>Support@abadnet.com.sa</strong>
      </p>

      <h3 className="pb-2">تطبيقات التواصل الاجتماعي</h3>
      <p className="pb-2" >يمكن التواصل معنا عبر تطبيقات التواصل الاجتماعي مثل واتساب وتويتر.</p>

      <h2 className="pb-2">الأدوار والمسؤوليات والصلاحيات</h2>
      <p className="pb-2">تنقسم الأدوار المطلوبة للقيام بالدعم الفني على عدة مستويات:</p>
      <ul>
        <p className="pb-2">
          <strong>المستوى الأول: مركز الاتصال لخدمة العملاء</strong>
          <br />
          ويقوم باستقبال جميع الاتصالات الواردة وكذلك تقديم الدعم الفني الأولي لها حسب طبيعة الاستفسارات الواردة أو تحويلها للإدارة المختصة.
        </p>
        <p className="pb-2">
          <strong>المستوى الثاني: الدعم الفني</strong>
          <br />
          ويتم من خلال هذا القسم استكمال عملية الدعم الفني والتحقق من استكمالها.
        </p>
      </ul>

      <h2 className="pb-2">ساعات العمل</h2>
      <p className="pb-2">أوقات العمل الرسمي طول أيام الأسبوع من 10 صباحاً إلى 10 مساءً، وأثناء أوقات إقامة الدورات التدريبية.</p>

      <h2 className="pb-2">رضا المستفيد</h2>
      <p >
        يتم قياس مستوى جودة الخدمة المقدمة وقياس رضا مستوى المستفيد منها بعد الانتهاء من البرنامج التدريبي عن طريق استبيان يرسل على البريد الإلكتروني أو عبر نظام التعليم الإلكتروني.
      </p>
      </div>
      <WhatsAppButton/>
      </>
    );
  };
  
  export default Technical;