
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovalEmailRequest {
  user_email: string;
  user_name: string;
  user_role: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_email, user_name, user_role, user_id }: ApprovalEmailRequest = await req.json();

    const approvalUrl = `https://eofmdmkpekwmvnoaftnr.supabase.co/functions/v1/approve-user?user_id=${user_id}&token=approve_${user_id}`;
    const rejectUrl = `https://eofmdmkpekwmvnoaftnr.supabase.co/functions/v1/approve-user?user_id=${user_id}&token=reject_${user_id}`;

    const emailResponse = await resend.emails.send({
      from: "نظام إدارة السياحة <onboarding@resend.dev>",
      to: ["klidmorre@gmail.com"],
      subject: "طلب موافقة على تسجيل موظف جديد",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #059669, #10B981); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 24px;">🌍 نظام إدارة السياحة</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">طلب موافقة على تسجيل موظف جديد</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #059669; margin-top: 0;">تفاصيل الموظف:</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-right: 4px solid #059669;">
              <p style="margin: 5px 0;"><strong>الاسم:</strong> ${user_name}</p>
              <p style="margin: 5px 0;"><strong>البريد الإلكتروني:</strong> ${user_email}</p>
              <p style="margin: 5px 0;"><strong>المنصب المطلوب:</strong> ${user_role}</p>
              <p style="margin: 5px 0;"><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleString('ar-SA')}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; margin-bottom: 20px;">يرجى مراجعة الطلب واتخاذ الإجراء المناسب:</p>
            
            <div style="display: inline-block; margin: 0 10px;">
              <a href="${approvalUrl}" 
                 style="background: linear-gradient(135deg, #059669, #10B981); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        display: inline-block;
                        margin: 5px;">
                ✅ الموافقة على التسجيل
              </a>
            </div>
            
            <div style="display: inline-block; margin: 0 10px;">
              <a href="${rejectUrl}" 
                 style="background: linear-gradient(135deg, #dc2626, #ef4444); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        display: inline-block;
                        margin: 5px;">
                ❌ رفض التسجيل
              </a>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-right: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>ملاحظة:</strong> بعد الموافقة، سيتمكن الموظف من الدخول إلى النظام والعمل وفقاً لصلاحيات منصبه.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © 2024 نظام إدارة السياحة - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      `,
    });

    console.log("Approval email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
