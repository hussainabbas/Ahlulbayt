package com.ahlulbaytplus.tasbih

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import com.ahlulbaytplus.R
import org.json.JSONObject

class TasbihWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    val prefs = context.getSharedPreferences(TasbihWidgetModule.PREFS_NAME, Context.MODE_PRIVATE)
    val json = prefs.getString(TasbihWidgetModule.KEY_SNAPSHOT, null)

    var todayTotal = 0
    var goalTotal = 100
    var streak = 0
    var phaseLabel = "Subhanallah"
    var phaseCount = 0
    var phaseTarget = 34

    if (json != null) {
      try {
        val obj = JSONObject(json)
        todayTotal = obj.optInt("todayTotal", 0)
        goalTotal = obj.optInt("dailyGoalTotal", 100)
        streak = obj.optInt("streak", 0)
        phaseLabel = obj.optString("phaseLabel", phaseLabel)
        phaseCount = obj.optInt("phaseCount", 0)
        phaseTarget = obj.optInt("phaseTarget", 34)
      } catch (_: Exception) {
        // keep defaults
      }
    }

    for (id in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.tasbih_widget)
      views.setTextViewText(R.id.tasbih_widget_total, "$todayTotal / $goalTotal")
      views.setTextViewText(R.id.tasbih_widget_streak, "🔥 $streak")
      views.setTextViewText(R.id.tasbih_widget_phase, "$phaseLabel $phaseCount/$phaseTarget")
      appWidgetManager.updateAppWidget(id, views)
    }
  }
}
