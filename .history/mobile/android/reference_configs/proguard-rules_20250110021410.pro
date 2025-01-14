# Reference proguard-rules.pro for React Native 0.71.x

# React Native specific rules
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Hermes engine
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Flipper
-keep class com.facebook.flipper.** { *; }
-keep class com.facebook.fbreact.specs.** { *; }

# React Native Navigation
-keep class com.facebook.react.turbomodule.** { *; }

# Keep your custom native modules
-keep class com.your.app.** { *; }

# Keep ReactNative classes
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }
-keep class com.facebook.react.modules.** { *; }

# Keep Reanimated classes
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Keep Fast Image classes
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}

# Keep SVG classes
-keep public class com.horcrux.svg.** {*;}

# Keep Safe Area Context classes
-keep class com.th3rdwave.safeareacontext.** { *; }

# Keep Screens classes
-keep class com.swmansion.rnscreens.** { *; }

# General Android rules
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes JavascriptInterface
-keepattributes Signature
-keepattributes Exceptions

# Crashlytics
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
