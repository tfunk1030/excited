Unable to match the desired swap behavior.
FATAL EXCEPTION: main
Process: com.excited_mobile, PID: 5190
java.lang.RuntimeException: Unable to instantiate activity ComponentInfo{com.excited_mobile/com.excited_mobile.MainActivity}: java.lang.ClassNotFoundException: Didn't find class "com.excited_mobile.MainActivity" on path: DexPathList[[zip file "/data/app/~~6nHZRo6Mxv4z9_SuXRwaUw==/com.excited_mobile-afpJFjFnhlXDQ7sV8mXTzg==/base.apk"],nativeLibraryDirectories=[/data/app/~~6nHZRo6Mxv4z9_SuXRwaUw==/com.excited_mobile-afpJFjFnhlXDQ7sV8mXTzg==/lib/x86_64, /data/app/~~6nHZRo6Mxv4z9_SuXRwaUw==/com.excited_mobile-afpJFjFnhlXDQ7sV8mXTzg==/base.apk!/lib/x86_64, /system/lib64, /system_ext/lib64]]
	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:3689)
	at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:3922)
	at android.app.servertransaction.LaunchActivityItem.execute(LaunchActivityItem.java:103)
	at android.app.servertransaction.TransactionExecutor.executeCallbacks(TransactionExecutor.java:139)
	at android.app.servertransaction.TransactionExecutor.execute(TransactionExecutor.java:96)
	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2443)
	at android.os.Handler.dispatchMessage(Handler.java:106)
	at android.os.Looper.loopOnce(Looper.java:205)
	at android.os.Looper.loop(Looper.java:294)
	at android.app.ActivityThread.main(ActivityThread.java:8177)
	at java.lang.reflect.Method.invoke(Native Method)
	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:552)
	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:971)
Caused by: java.lang.ClassNotFoundException: Didn't find class "com.excited_mobile.MainActivity" on path: DexPathList[[zip file "/data/app/~~6nHZRo6Mxv4z9_SuXRwaUw==/com.excited_mobile-afpJFjFnhlXDQ7sV8mXTzg==/base.apk"],nativeLibraryDirectories=[/data/app/~~6nHZRo6Mxv4z9_SuXRwaUw==/com.excited_mobile-afpJFjFnhlXDQ7sV8mXTzg==/lib/x86_64, /data/app/~~6nHZRo6Mxv4z9_SuXRwaUw==/com.excited_mobile-afpJFjFnhlXDQ7sV8mXTzg==/base.apk!/lib/x86_64, /system/lib64, /system_ext/lib64]]
	at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:259)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:379)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:312)
	at android.app.AppComponentFactory.instantiateActivity(AppComponentFactory.java:95)
	at androidx.core.app.CoreComponentFactory.instantiateActivity(CoreComponentFactory.java:45)
	at android.app.Instrumentation.newActivity(Instrumentation.java:1378)
	at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:3676)
	at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:3922) 
	at android.app.servertransaction.LaunchActivityItem.execute(LaunchActivityItem.java:103) 
	at android.app.servertransaction.TransactionExecutor.executeCallbacks(TransactionExecutor.java:139) 
	at android.app.servertransaction.TransactionExecutor.execute(TransactionExecutor.java:96) 
	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2443) 
	at android.os.Handler.dispatchMessage(Handler.java:106) 
	at android.os.Looper.loopOnce(Looper.java:205) 
	at android.os.Looper.loop(Looper.java:294) 
	at android.app.ActivityThread.main(ActivityThread.java:8177) 
	at java.lang.reflect.Method.invoke(Native Method) 
	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:552) 
	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:971) 
File error accessing recents directory (directory doesn't exist?).
package com.excited_mobile;

import android.content.Context;
import com.facebook.flipper.android.AndroidFlipperClient;
import com.facebook.flipper.android.utils.FlipperUtils;
import com.facebook.flipper.core.FlipperClient;
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin;
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin;
import com.facebook.flipper.plugins.fresco.FrescoFlipperPlugin;
import com.facebook.flipper.plugins.inspector.DescriptorMapping;
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin;
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor;
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin;
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin;
import com.facebook.react.ReactInstanceEventListener;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.network.NetworkingModule;
import okhttp3.OkHttpClient;

public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (FlipperUtils.shouldEnableFlipper(context)) {
      final FlipperClient client = AndroidFlipperClient.getInstance(context);

      client.addPlugin(new InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()));
      client.addPlugin(new DatabasesFlipperPlugin(context));
      client.addPlugin(new SharedPreferencesFlipperPlugin(context));
      client.addPlugin(CrashReporterPlugin.getInstance());

      NetworkFlipperPlugin networkFlipperPlugin = new NetworkFlipperPlugin();
      NetworkingModule.setCustomClientBuilder(
          builder -> builder.addNetworkInterceptor(new FlipperOkhttpInterceptor(networkFlipperPlugin)));
      client.addPlugin(networkFlipperPlugin);
      client.start();

      // Fresco Plugin needs to ensure that ImagePipelineFactory is initialized
      // Hence we run if after all native modules have been initialized
      ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
      if (reactContext == null) {
        reactInstanceManager.addReactInstanceEventListener(
            new ReactInstanceEventListener() {
              @Override
              public void onReactContextInitialized(ReactContext reactContext) {
                reactInstanceManager.removeReactInstanceEventListener(this);
                client.addPlugin(new FrescoFlipperPlugin());
              }
            });
      } else {
        client.addPlugin(new FrescoFlipperPlugin());
      }
    }
  }
}