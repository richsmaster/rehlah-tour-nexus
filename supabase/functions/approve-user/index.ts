
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const token = url.searchParams.get("token");

    if (!user_id || !token) {
      return new Response("Missing parameters", { status: 400 });
    }

    const isApproval = token.startsWith("approve_");
    const isRejection = token.startsWith("reject_");

    if (!isApproval && !isRejection) {
      return new Response("Invalid token", { status: 400 });
    }

    if (isApproval) {
      // Approve user
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', user_id);

      if (error) {
        console.error("Error approving user:", error);
        return new Response("Error approving user", { status: 500 });
      }

      return new Response(`
        <html dir="rtl">
          <head>
            <meta charset="UTF-8">
            <title>تمت الموافقة بنجاح</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 100px auto; 
                padding: 40px; 
                text-align: center; 
                background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .success { 
                color: #059669; 
                font-size: 48px; 
                margin-bottom: 20px;
              }
              h1 { 
                color: #059669; 
                margin-bottom: 20px; 
              }
              p { 
                color: #374151; 
                font-size: 18px; 
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <div class="success">✅</div>
            <h1>تمت الموافقة بنجاح!</h1>
            <p>تم الموافقة على تسجيل الموظف في النظام.</p>
            <p>يمكن للموظف الآن تسجيل الدخول والعمل في النظام.</p>
          </body>
        </html>
      `, { 
        headers: { "Content-Type": "text/html; charset=utf-8" } 
      });
    } else {
      // Reject user
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user_id);

      if (error) {
        console.error("Error rejecting user:", error);
        return new Response("Error rejecting user", { status: 500 });
      }

      // Also delete from auth.users
      const { error: authError } = await supabase.auth.admin.deleteUser(user_id);
      if (authError) {
        console.error("Error deleting auth user:", authError);
      }

      return new Response(`
        <html dir="rtl">
          <head>
            <meta charset="UTF-8">
            <title>تم رفض التسجيل</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 600px; 
                margin: 100px auto; 
                padding: 40px; 
                text-align: center; 
                background: linear-gradient(135deg, #fef2f2, #fecaca);
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .reject { 
                color: #dc2626; 
                font-size: 48px; 
                margin-bottom: 20px;
              }
              h1 { 
                color: #dc2626; 
                margin-bottom: 20px; 
              }
              p { 
                color: #374151; 
                font-size: 18px; 
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <div class="reject">❌</div>
            <h1>تم رفض التسجيل</h1>
            <p>تم رفض طلب تسجيل الموظف في النظام.</p>
            <p>تم حذف الحساب نهائياً من النظام.</p>
          </body>
        </html>
      `, { 
        headers: { "Content-Type": "text/html; charset=utf-8" } 
      });
    }
  } catch (error: any) {
    console.error("Error in approve-user function:", error);
    return new Response("Internal server error", { status: 500 });
  }
};

serve(handler);
