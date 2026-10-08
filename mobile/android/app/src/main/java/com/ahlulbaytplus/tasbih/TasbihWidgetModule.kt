package com.ahlulbaytplus.tasbih

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TasbihWidgetModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "TasbihWidgetModule"

  @ReactMethod
  fun updateWidget(json: String) {
    val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().putString(KEY_SNAPSHOT, json).apply()

    val intent = Intent(reactContext, TasbihWidgetProvider::class.java).apply {
      action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
      val ids = AppWidgetManager.getInstance(reactContext)
        .getAppWidgetIds(ComponentName(reactContext, TasbihWidgetProvider::class.java))
      putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
    }
    reactContext.sendBroadcast(intent)
  }

  companion object {
    const val PREFS_NAME = "tasbih_widget"
    const val KEY_SNAPSHOT = "snapshot"
  }
}
